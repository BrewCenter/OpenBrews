// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('RecipeUtils', function() {
	var RecipeUtils;

	// Before each test load our api.users module
	beforeEach(angular.mock.module('openbrews.recipeUtils'));

	// Before each test set our injected Users factory (_Users_) to our local Users variable
	beforeEach(inject(function(_RecipeUtils_) {
		RecipeUtils = _RecipeUtils_;
	}));

  it('should exist', function() {
    expect(RecipeUtils).toBeDefined();
  });
});