describe('util', function() {
	var util;

	it('should be exposed via require("util")', function(done) {
		require(["util"], function(lib) {
			util = lib;

			expect(util).to.exist;
			expect(util).to.be.an('object');
			done();
		});
	});


	describe('Array.isArray()', function() {
		it('should be a function', function() {
			expect(Array).to.have.property('isArray');
			expect(Array.isArray).to.be.a('function');
		});

		it('should return false for non-Arrays', function() {
			expect( Array.isArray({}) ).to.equal(false);
			expect( Array.isArray("foo") ).to.equal(false);
			expect( Array.isArray(25) ).to.equal(false);
			expect( Array.isArray(/foo/g) ).to.equal(false);
			expect( Array.isArray(null) ).to.equal(false);
			expect( Array.isArray(undefined) ).to.equal(false);
		});

		it('should return true for Arrays', function() {
			expect( Array.isArray([]) ).to.equal(true);
			expect( Array.isArray(new Array()) ).to.equal(true);
		});

		it('should return true for Arrays created in other contexts', function() {
			var frame = document.createElement('iframe'),
				win, arr;

			document.body.appendChild(frame);
			win = frame.contentWindow;

			expect( Array.isArray(new win.Object()) ).to.equal(false);

			arr = new win.Array();
			expect( Array.isArray(arr) ).to.equal(true);

			win.document.write('<script>window.arr=[];</script>');
			expect( Array.isArray(win.arr) ).to.equal(true);
		});
	});

});
