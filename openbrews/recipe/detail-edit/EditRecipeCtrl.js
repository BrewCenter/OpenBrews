//AddRecipe shows a list of recipes saved to the users device or profile
(function(){
  'use strict';
  angular.module('openbrews.editRecipe', [
    'openbrews.otherIngredientDirective',
    'openbrews.noteDirective',
    'openbrews.recipeStore',
    'openbrews.recipeUtils',
    'openbrews.breweryDB'
  ])
    .controller('EditRecipeCtrl', 
      [
        '$scope', 
        '$state', 
        '$http', 
        '$filter', 
        '$q',
        '$ionicModal',
        '$ionicTabsDelegate',
        'RecipeStore', 
        'RecipeUtils', 
        'BreweryDB', 
      function(
        $scope, 
        $state, 
        $http, 
        $filter, 
        $q,
        $ionicModal,
        $ionicTabsDelegate,
        RecipeStore, 
        RecipeUtils, 
        BreweryDB
      ) {

      $scope.tab = 0;

      $scope.setTab = function(tab) {
        $scope.tab = tab;
        $ionicTabsDelegate.select(tab);
      }

      var defaultRecipe = {
        name: '',
        style: '',
        boilSize: 5,
        boilSizeUnits: 'Gal',
        boilTime: 60,
        estFermentationDays: 7,
        secondaryTimeDays: 0,
        mashEfficiency: 68,
        steepEfficiency: 30,
        og: 0,
        fg: 0,
        abv: 0,
        abw: 0,
        fermentables: [],
        hops: [],
        yeasts: [],
        others: [],
        notes: []
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove();
      }

      /************************************************************************
       * Fermentables
       ************************************************************************/

       /*
        * Helper function for adding a new fermentable. */
      $scope.addFermentable = function() {
        return $scope.editFermentable();
      }      
      /*
       * Adds a new fermentable or edits an existing one. Called
       * in the template to show the edit fermentable modal. If one
       * exists, it will fill the form with existing data. */
      $scope.editFermentable = function(index) {
        /* initialize the fermentable object */
        var fermentable;
        if(index !== undefined) {
          fermentable = $scope.recipe.fermentables[index];
        } else {
          fermentable = {
            method: 'Mash',
            weight: 0,
            weightUnits: 'Lbs',
            addTime: 60,
            ppg: 0,
            srm: 0
          };
        }

        // save tmp variables for use in the modal
        $scope.fermentableTmp = fermentable;

        //show the modal
        $ionicModal.fromTemplateUrl('recipe/detail-edit/tabs/fermentables/modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };

      /*
       * Saves a fermentable. If index is null it will save
       * a new instance. */
      $scope.saveFermentable = function(fermentable, index) {
        if(index !== undefined) {
          $scope.recipe.fermentables[index] = fermentable;
        } else {
          $scope.recipe.fermentables.push(fermentable);
        }
        $scope.closeModal();
      };

      /* 
       * Sets the selected fermentable name. If it was selected
       * from a smart type field, it will look for additional data
       * to save. */
      $scope.setFermentableName = function(item, fermentable){
        if(typeof(item) == "string") {
          fermentable.name = item;
        } else {
          fermentable.name = item.name;
          if(item.srm) {
            fermentable.srm = item.srm;
          }
          if(item.ppg) {
            fermentable.ppg = item.ppg;
          }
        }
      };

      /* remove the fermentable at the given index */
      $scope.deleteFermentable = function(index) {
        $scope.recipe.fermentables.splice(index,1);
      };

      /************************************************************************
       * Hops
       ************************************************************************/   

      /* Add a new Hop */
      $scope.addHop = function() {
        return $scope.editHop();
      }
      $scope.editHop = function(index) {
        /* initialize the hop object */
        var hop;
        if(index !== undefined) {
          hop = $scope.recipe.hops[index];
        } else {
          hop = {
            weight: 0,
            weightUnits: 'oz',
            type: 'Pellet',
            aa: 0,
            stage: 'Boil',
            addTime: 0
          }
        }

        // save tmp variables for use in the modal
        $scope.hopIndex = index;
        $scope.hopTmp = hop;

        //show the modal
        $ionicModal.fromTemplateUrl('recipe/detail-edit/tabs/hops/modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };

      /* remove the Hop at the given index */
      $scope.deleteHop = function(index) {
        $scope.recipe.hops.splice(index,1);
      };

      /* set the style selected */
      $scope.setHop = function(item, hop){
        if(typeof(item) == "string") {
          hop.name = item;
        } else {
          hop.name = item.name;
          if(item.alphaAcidMin) {
            hop.aa = item.alphaAcidMin;
          }
        }
      };

      /*
       * Saves a hop. If index is null it will save
       * a new instance. */
      $scope.saveHop = function(hop, index) {
        if(index !== undefined) {
          $scope.recipe.hops[index] = hop;
        } else {
          $scope.recipe.hops.push(hop);
        }
        $scope.closeModal();
      };

      /************************************************************************
       * Yeast
       ************************************************************************/  

      /* 
       * Helper function for adding a yeast instead of 
       * editing an existing yeast. */
      $scope.addYeast = function() {
        return $scope.editYeast();
      };

      /* Add a new yeast */
      $scope.editYeast = function(index) {
        /* inhitialize the yeast object */
        var yeast;
        if(index !== undefined) {
          yeast = $scope.recipe.yeasts[index];
        } else {
          yeast = {
            amount: 0,
            attenuation: 0,
            alcoholTolerance: 0,
            flocculation: 'Medium-Low',
            amountUnits: 'G'
          }
        }

        // save tmp variables for use in the modal
        $scope.yeastIndex = index;
        $scope.yeastTmp = yeast;

        //show the modal
        $ionicModal.fromTemplateUrl('recipe/detail-edit/tabs/yeast/modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };

      /* Delete the yeast at supplied index */
      $scope.deleteYeast = function(index) {
        $scope.recipe.yeasts.splice(index, 1);
      };

      /* set the style selected */
      $scope.setYeast = function(item, yeast){
        if(typeof(item) == "string") {
          yeast.name = item;
        } else {
          yeast.name = item.name;
          if(item.attenuationMin) {
            yeast.attenuation = item.attenuationMin;
          }
        }
      };

      /*
       * Saves a yeast. If index is null it will save
       * a new instance. */
      $scope.saveYeast = function(yeast, index) {
        if(index !== undefined) {
          $scope.recipe.yeasts[index] = yeast;
        } else {
          $scope.recipe.yeasts.push(yeast);
        }
        $scope.closeModal();
      };

      /************************************************************************
       * Other/Basic Info functions
       ************************************************************************/

      /* Add other ingredient. */
      $scope.addOther = function() {
        $scope.recipe.others.push({
          name: '',
          amount: 0,
          amountUnits: 'oz',
          stage: 'Boil',
          addTime: 0
        });
      };

      /* Delete other ingredient. */
      $scope.deleteOther = function(index) {
        $scope.recipe.others.splice(index,1);
      };


      /* Add a new note */
      $scope.addNote = function() {
        $scope.recipe.notes.push({
          'text': ''
        });
      };

      /* Delete the given note */
      $scope.deleteNote = function(index) {
        $scope.recipe.notes.splice(index, 1);
      };

      /* Save a recipe in LocalStorage */
      $scope.saveRecipe = function() {
        angular.forEach($scope.recipeForm.$error, function (field) {
            angular.forEach(field, function(errorField){
                errorField.$setTouched();
                errorField.$setDirty();
            })
        });
        if($scope.recipeForm.$valid) {
          if ($state.params.isNew) {
            RecipeStore.insert($scope.recipe);
          } else {
            RecipeStore.update($scope.recipe);
          }
          $state.go('recipes');
        }
      };


      ////////////////////////////////////////////////////////////
      // Functions that watch variables and update calculated
      // values appropriately
      ///////////////////////////////////////////////////////////

      function updateOG () {
        $scope.recipe.og = RecipeUtils.calcOG($scope.recipe);
      }

      function updateFG () {
        $scope.recipe.fg = RecipeUtils.calcFG($scope.recipe);
      }

      function updateABV () {
        $scope.recipe.abv = RecipeUtils.calcABV($scope.recipe);
      }

      function updateABW () {
        $scope.recipe.abw = RecipeUtils.calcABW($scope.recipe);
      }

      function updateIBU() {
        $scope.recipe.ibu = RecipeUtils.calcIBU($scope.recipe);
      }

      function updateSRM() {
        $scope.recipe.srm = RecipeUtils.calcSRM($scope.recipe);
      }

      function srmWatcher() {
        updateSRM();
      }

      function ibuWatcher() {
        updateIBU();
      }

      function abvWatcher () {
        updateABW();
      }

      function fgWatcher () {
        updateFG();
        updateABV();
        updateABW();
      }

      function ogWatcher () {
        updateOG();
        updateFG();
        updateABV();
        updateABW();
        updateIBU();
      }

      /* Make OG recalculate when it's dependencies change */
      $scope.$watchGroup(
        [
          'recipe.boilSize',
          'recipe.boilSizeUnits',
          'recipe.mashEfficiency',
          'recipe.steepEfficiency'
        ],
        ogWatcher);

      /* recalculate srm when it's dependencies change */
      $scope.$watchGroup(
        [
          'recipe.boilSize',
          'recipe.boilSizeUnits'
        ],
        srmWatcher);

      /* for srm and og */
      $scope.$watchCollection(
        'recipe.fermentables',
        function (newVals) {
          var i;
          for(i = 0; i < newVals.length; ++i) {
            $scope.$watchCollection('recipe.fermentables[' + i + ']', ogWatcher);
            $scope.$watchCollection('recipe.fermentables[' + i + ']', srmWatcher);
          }
        });

      /* update FG and abv when it's dependencies change */
      $scope.$watchCollection(
        'recipe.yeasts',
        function (newVals) {
          var i;
          for(i = 0; i < newVals.length; ++i) {
            $scope.$watchCollection('recipe.yeasts[' + i + ']', fgWatcher);
            $scope.$watchCollection('recipe.yeasts[' + i + ']', abvWatcher);
          }
        });
      
      /* update ibu when it's dependencies change */
      $scope.$watchCollection(
        'recipe.hops',
        function (newVals) {
          var i;
          for(i = 0; i < newVals.length; ++i) {
            $scope.$watchCollection('recipe.hops[' + i + ']', ibuWatcher);
          }
        });

      /////////////////////////////////////////////////////////////
      // Smart Type Functions
      /////////////////////////////////////////////////////////////

      /* set the style selected */
      $scope.setStyle = function(item){
        $scope.recipe.style = item;
      };

      $scope.filterItems = function(styles, userInput) {
        return $q(function(resolve, reject) {
          var filter = $filter('filter');
          var items = filter(styles, userInput, false);
          if(items.length > 0) {
            resolve(items);
          } else {
            reject(items);
          }
        });
      };

      // Initializer
      (function () {
        // Differentiate between add or edit
        if ($state.params.recipeId) {
            var recipe = RecipeStore.get($state.params.recipeId);
            if (recipe) {
              $scope.recipe = recipe;
              $scope.pageTitle = 'Edit Recipe';
            } else {
              // This Recipe doesn't exist
              $state.go('recipes');
            }
        } else {
          if ($state.params.isNew) {
            $scope.recipe = defaultRecipe;
            $scope.pageTitle = 'Add Recipe';
          } else {
            // Wrong state: Has no recipe id and is not new
            $state.go('recipes');
          }
        }

        //load beer data
        $scope.styles = BreweryDB.getStyles();
        $scope.fermentables = BreweryDB.getFermentables();
        $scope.hops = BreweryDB.getHops();
        $scope.yeasts = BreweryDB.getYeasts();
      })();

    }]);
})();
