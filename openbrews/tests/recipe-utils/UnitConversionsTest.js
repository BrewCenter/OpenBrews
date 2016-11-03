  /*
   * Expected values calculated using Google unit conversion
   */
describe('UnitConversionsTest', function() {
  var RecipeUtils;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.unitConversions'));

  var roundTo = function(val, decimals) {
    return parseFloat(val.toFixed(decimals));
  };

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_UnitConversions_) {
      UnitConversions = _UnitConversions_;
  }));

  it("L to Gal", function() {
    expect(UnitConversions.LToGal(0)).toEqual(0);
    expect(UnitConversions.LToGal(1)).toEqual(0.264172);
    expect(roundTo(UnitConversions.LToGal(5.5), 5)).toEqual(1.45295);
    expect(roundTo(UnitConversions.LToGal(10.125), 5)).toEqual(2.67474);
    expect(roundTo(UnitConversions.LToGal(100.125), 5)).toEqual(26.45022);
  });

  it('Kg to Lbs', function() {
    expect(UnitConversions.KgToLbs(0)).toEqual(0);
    expect(UnitConversions.KgToLbs(1)).toEqual(2.20462);
    expect(roundTo(UnitConversions.KgToLbs(2.513), 5)).toEqual(5.54021);    //Accurate to 5 decimals
    expect(roundTo(UnitConversions.KgToLbs(25.6), 3)).toEqual(56.438);      //Accurate to 3 decimals
    expect(roundTo(UnitConversions.KgToLbs(1000.521), 1)).toEqual(2205.8);  // Accurate to 1 decimal
  });
  
});