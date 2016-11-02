/*
 * Expected values calculated using online calculators such as
 * https://www.brewersfriend.com/homebrew/recipe/calculator/
 */
describe('RecipeUtils calcIBU', function() {
  var RecipeUtils;
  var recipe,hop1,hop2;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.recipeUtils'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_RecipeUtils_) {
      RecipeUtils = _RecipeUtils_;
      /* define some basic data. */
      recipe = {
        og: 1.060,
        boilTime: 60,
        boilSize: 5,
        boilSizeUnits: "Gal",
        hops: []
      };
      hop1 = {
        weight: 2,
        weightUnits: "oz",
        stage: "Boil",
        aa: 12,
        addTime: 60
      };
      hop2 = {
        weight: 1,
        weightUnits: "oz",
        stage: "Boil",
        aa: 8,
        addTime: 30
      };
  }));//end beforeEach

  it("hop utilization is correct", function() {
    recipe.og = 1.060;
    hop1.addTime = 60;
    expect(RecipeUtils.getHopUtilization(recipe, hop1)).toBeCloseTo(0.211);
    recipe.og = 1.030;
    hop1.addTime = 0;
    expect(RecipeUtils.getHopUtilization(recipe, hop1)).toBeCloseTo(0);
    recipe.og = 1.130;
    hop1.addTime = 120;
    expect(RecipeUtils.getHopUtilization(recipe, hop1)).toBeCloseTo(0.123);
  });

  it("empty recipe is 0 ibu", function() {
    expect(RecipeUtils.calcIBU(recipe)).toEqual(0);
  });

  it("single hop yields expected ibu", function() {
    recipe.hops = [hop1];
    expect(RecipeUtils.calcIBU(recipe)).toBeCloseTo(75.8);
    hop1.weight = 4;
    recipe.hops = [hop1];
    expect(RecipeUtils.calcIBU(recipe)).toBeCloseTo(151.60);
    hop1.weight = 1;
    hop1.aa = 18;
    recipe.hops = [hop1];
    expect(RecipeUtils.calcIBU(recipe)).toBeCloseTo(56.85);
    hop1.weight = 2;
    hop1.aa = 12;
    hop1.addTime = 20; 
    expect(RecipeUtils.calcIBU(recipe)).toBeCloseTo(45.91);
  });

  it("varying boilSize and og calculate correct ibu", function() {
    recipe.hops = [hop1];
    recipe.boilSize = 4;
    recipe.og = 1.060;
    expect(RecipeUtils.calcIBU(recipe)).toBeCloseTo(94.75);
    recipe.og = 1.040;
    expect(RecipeUtils.calcIBU(recipe)).toBeCloseTo(113.41);
  });

  it("second single hop calculates correctly on its own", function() {
    recipe.hops = [hop2];
    expect(RecipeUtils.calcIBU(recipe)).toBeCloseTo(19.42);
  });

  it("multiple hops calculate correctly", function() {
    recipe.hops = [hop1, hop2];
    expect(RecipeUtils.calcIBU(recipe)).toBeCloseTo(95.22);
  });

});