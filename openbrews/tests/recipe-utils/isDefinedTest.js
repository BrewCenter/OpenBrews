// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('RecipeUtils Function Definitions', function() {
  var RecipeUtils;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.recipeUtils'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_RecipeUtils_) {
      RecipeUtils = _RecipeUtils_;
  }));

  it('module should exist', function() {
    expect(RecipeUtils).toBeDefined();
  });

  it('calcOG should exist', function() {
    expect(RecipeUtils.calcOG).toBeDefined();
  });

  it('calcFG should exist', function() {
    expect(RecipeUtils.calcFG).toBeDefined();
  });

  it('calcABV should exist', function() {
    expect(RecipeUtils.calcABV).toBeDefined();
  });

  it('calcABW should exist', function() {
    expect(RecipeUtils.calcABW).toBeDefined();
  });

  it('calcIBU should exist', function() {
    expect(RecipeUtils.calcIBU).toBeDefined();
  });

  it('calcSRM should exist', function() {
    expect(RecipeUtils.calcSRM).toBeDefined();
  });
  
});