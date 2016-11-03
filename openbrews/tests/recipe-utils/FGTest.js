/*
 * Expected values calculated using online calculators such as
 * https://www.brewersfriend.com/homebrew/recipe/calculator/
 */
describe('RecipeUtils calcFG', function() {
  var RecipeUtils;
  var recipe,yeast1,yeast2;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.recipeUtils'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_RecipeUtils_) {
      RecipeUtils = _RecipeUtils_;
      /* define some basic data. */
      recipe = {
        yeasts: []
      };
      yeast1 = {
        amount: 11.5,
        amountUnits: "G",
        attenuation: 75,
        flocculation: "Medium-Low"
      };
      yeast2 = {
        amount: 4,
        amountUnits: "G",
        attenuation: 72,
        flocculation: "Medium-Low"
      };
  }));//end beforeEach

  it("should be 0", function() {
    recipe.og = 0;
    yeast1.attenuation = 0;
    recipe.yeasts = [yeast1];
    expect(RecipeUtils.calcFG(recipe)).toEqual(0);
  });

  it("basic fg calculation", function() {
    recipe.og = 1.060;
    recipe.yeasts = [yeast1];
    expect(RecipeUtils.calcFG(recipe)).toEqual(1.015);
  });

  it("multiple yeast strains", function() {
    recipe.og = 1.060;
    recipe.yeasts = [
      yeast1,
      yeast2
    ];
    expect(RecipeUtils.calcFG(recipe)).toEqual(1.015);
  });

  it("FG of water remains the same", function() {
    recipe.og = 1.000;//OG with density of water should yeild the same FG
    recipe.yeasts = [yeast1];
    expect(RecipeUtils.calcFG(recipe)).toEqual(1.000);
  });

  /* because of how FG is estimated, the lowest value we can have is 1 */
  it("Estimated FG can't be below 1.000", function() {
    recipe.og = 2;
    yeast1.attenuation = 100;
    recipe.yeasts = [yeast1];
    expect(RecipeUtils.calcFG(recipe)).toEqual(1.000);
  });  

});