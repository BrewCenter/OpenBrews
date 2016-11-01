  /*
   * Expected values calculated using online calculators such as
   * https://www.brewersfriend.com/homebrew/recipe/calculator/
   */
describe('RecipeUtils calcOG', function() {
  var RecipeUtils;
  var basicRecipe,mashedFermentable1, mashedFermentable2;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.recipeUtils'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_RecipeUtils_) {
      RecipeUtils = _RecipeUtils_;
      /* define some basic data. */
      recipe = {
        boilSize: 5,
        boilSizeUnits: "Gal",
        mashEfficiency: 68,
        steepEfficiency: 30,
        fermentables: []
      };
      mashedFermentable1 = {
        name: "American 2-Row",
        method: "Mash",
        weight: 11.5,
        weightUnits: "Lbs",
        addTime: 60,
        ppg: 38,
        srm: 1
      };
      mashedFermentable2 = {
        name: "English 2-Row",
        method: "Mash",
        weight: 3,
        weightUnits: "Lbs",
        addTime: 60,
        ppg: 34,
        srm: 2
      };
      steepedFermentable1 = {
        name: "Carapils",
        method: "Steeped",
        weight: 3,
        weightUnits: "Lbs",
        addTime: 60,
        ppg: 33,
        srm: 2
      };
      extractFermentable1 = {
        name: "American 2-Row",
        method: "Extract",
        weight: 9.3,
        weightUnits: "Lbs",
        addTime: 60,
        ppg: 38,
        srm: 2
      };
  }));//end beforeEach

  it('simple mashed grain test', function() {
    recipe.fermentables = [mashedFermentable1];
    expect(RecipeUtils.calcOG(recipe)).toEqual(1.059);
  });

  it('two mashed grains test', function() {
    recipe.fermentables = [
      mashedFermentable1,
      mashedFermentable2
    ];
    expect(RecipeUtils.calcOG(recipe)).toEqual(1.073);
  });

  it('steeped and mashed grain test', function() {
    recipe.fermentables = [
      mashedFermentable1,
      steepedFermentable1
    ];
    /* Note: this expected value could not be calculated. I could not find a calculator
       to calculate mashed and steeped grains at different efficiencies, but I wanted to make
       sure it could be done. This value is returned from the calcOG function. This test ensures
       the value doesn't change. */
    expect(RecipeUtils.calcOG(recipe)).toEqual(1.079);
  });

  it('extract test', function() {
    recipe.fermentables = [extractFermentable1];
    expect(RecipeUtils.calcOG(recipe)).toEqual(1.071);
  });
  
  it('extract and steeped test', function() {
    recipe.fermentables = [
      extractFermentable1,
      steepedFermentable1
    ];
    expect(RecipeUtils.calcOG(recipe)).toEqual(1.09);
  });

});