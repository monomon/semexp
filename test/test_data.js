var testData = {
	"musical": {
		"entities": {
			"is": {},
			"isA": {},
			"musical instrument": {
				"classOf": ["idiophone", "membranophone", "chordophone", "aerophone"]
			},
			"idiophone": {
				"isA": ["musical instrument"],
				"classOf": ["xylophone", "claves"]
			},
			"xylophone": {
				"isA": ["idiophone"]
			},
			"claves": {
				"isA": ["idiophone"]
			},
			"membranophone": {
				"isA": ["musical instrument"],
				"classOf": ["djembe", "darbuka"]
			},
			"djembe": {
				"isA": ["membranophone"]
			},
			"darbuka": {
				"isA": ["membranophone"]
			},
			"chordophone": {
				"isA": ["musical instrument"],
				"classOf": ["piano", "guitar"]
			},
			"piano": {
				"isA": ["chordophone"]
			},
			"guitar": {
				"isA": ["chordophone"]
			},
			"aerophone": {
				"isA": ["musical instrument"],
				"classOf": ["flute", "trumpet"]
			},
			"flute": {
				"isA": ["aerophone"]
			},
			"trumpet": {
				"isA": ["aerophone"]
			}
		},
		"relations": {
			"is": {
				"transitive": true,
				"opposite": "contains"
			},
			"contains": {
				"transitive": true,
				"opposite": "is"
			},
			"isA": {
				"transitive": false,
				"opposite": "classOf"
			},
			"classOf": {
				"transitive": false,
				"opposite": "isA"
			}
		}
	}
};