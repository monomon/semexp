from google.appengine.ext import db
#from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
from google.appengine.ext.db import djangoforms
#import urllib
import os
import colorsys
import math
import random

vote_colors=[
'#0000ff',
'#1300fe',
'#2601fc',
'#3806f8',
'#4b11f3',
'#5d26ed',
'#6e42e5',
'#7f64dc',
'#8f86d2',
'#9ea1c7',
'#adb0ba',
'#bab0ad',
'#c7a19e',
'#d2868f',
'#dc647f',
'#e5426e',
'#ed265d',
'#f3114b',
'#f80638',
'#fc0126',
'#fe0013'
]

class MainPage(webapp.RequestHandler):
	def get(self):
		#get data for persons and links
		path = os.path.join(os.path.dirname(__file__), 'mic.html')
#		if Vote.all():
#			self.response.out.write(Vote.get('votes_min'))
#		votes_min = min(Link.all().order('votes')[0].votes, Person.all().order('votes')[0].votes)
#		votes_max = max(Link.all().order('-votes')[0].votes, Person.all().order('-votes')[0].votes)
#		v_min = Vote(key_name='votes_min', value=votes_min)
#		v_min.put()
#		v_max = Vote(key_name='votes_max', value=votes_max)
#		v_max.put()
		self.response.out.write(template.render(path, {'Version':random.randint(1, 500)}))

class drawGraph(webapp.RequestHandler):
	'''call the script that draws the graph with data from the store'''
	def get(self):
		temp_data = {'ppl': Person.all(), 'links': Link.all()}
		path = os.path.join(os.path.dirname(__file__), 'drawGraph.js')
		self.response.out.write(template.render(path, temp_data))

class Vote(db.Model):
	value = db.IntegerProperty()

class Person(db.Model):
	name = db.StringProperty(required=True)
	description = db.StringProperty(multiline=True)
	votes_for = db.IntegerProperty()
	votes_against = db.IntegerProperty()
	votes = db.IntegerProperty()
	def __unicode__(self):
		return self.name
	def get_color(self):
		'''get color mapped between minimum and maximum number of votes'''
		votes_min = Vote.get(db.Key.from_path('Vote', 'votes_min')).value
		votes_max = Vote.get(db.Key.from_path('Vote', 'votes_max')).value
		return vote_colors[int(float(self.votes-votes_min)/(votes_max-votes_min)*(len(vote_colors)-1))]

class Link(db.Model):
	p1 = db.ReferenceProperty(Person, collection_name='person1', required=True)
	p2 = db.ReferenceProperty(Person, collection_name='person2', required=True)
	description = db.StringProperty(multiline=True)
	votes_for = db.IntegerProperty()
	votes_against = db.IntegerProperty()
	votes = db.IntegerProperty()
	def get_color(self):
		'''get color mapped between minimum and maximum number of votes'''
		votes_min = Vote.get(db.Key.from_path('Vote', 'votes_min')).value
		votes_max = Vote.get(db.Key.from_path('Vote', 'votes_max')).value
		return vote_colors[int(float(self.votes-votes_min)/(votes_max-votes_min)*(len(vote_colors)-1))]

class addPersonForm(djangoforms.ModelForm):
	class Meta:
		model = Person

class savePerson(webapp.RequestHandler):
	'''save to datastore here'''
	def post(self):
		data = addPersonForm(data=self.request.POST)
		if data.is_valid():
			p = data.save(commit=False)
			p.votes = p.votes_for - p.votes_against
			p.put()
			votes_min =  Vote.get(db.Key.from_path('Vote', 'votes_min'))
			votes_max =  Vote.get(db.Key.from_path('Vote', 'votes_max'))
			if p.votes>votes_max.value:
				votes_max.value=p.votes
				votes_max.put()
			if p.votes<votes_min.value:
				votes_min.value=p.votes
				votes_min.put()
				
		else:
			self.redirect('/addPerson')

class addPerson(webapp.RequestHandler):
	def get(self): 
		self.response.out.write('<form method="POST" '
								'action="/savePerson" class="addForm">'
								'<table>')
		self.response.out.write(addPersonForm())
		self.response.out.write('</table>'
								'<input type="submit" value="save person">'
								'</form>')
class addLinkForm(djangoforms.ModelForm):
	class Meta:
		model = Link

class saveLink(webapp.RequestHandler):
	def post(self):
		data = addLinkForm(data=self.request.POST)
		if data.is_valid():
			l = data.save(commit=False)
			l.votes=l.votes_for-l.votes_against
			l.put()
			votes_min = Vote.get(db.Key.from_path('Vote', 'votes_min'))
			votes_max = Vote.get(db.Key.from_path('Vote', 'votes_max'))
			#update minimum and maximum votes if we got new values
			if l.votes>votes_max.value:
				votes_max.value=l.votes
				votes_max.put()
			if l.votes<votes_min.value:
				votes_min.value=l.votes
				votes_min.put()
		else:
			self.redirect('/addLink')

class addLink(webapp.RequestHandler):
	def get(self):
		self.response.out.write('<form method="POST" '
			'action="/saveLink" class="addForm">'
			'<table>')
		self.response.out.write(addLinkForm())
		self.response.out.write('</table>'
			'<input type="submit" value="save link">'
			'</form>')

application = webapp.WSGIApplication(
	[('/', MainPage),
	('/drawGraph', drawGraph),
	('/savePerson', savePerson),
	('/addPerson', addPerson),
	('/saveLink', saveLink),
	('/addLink', addLink)
	],
	debug=True)


def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()
