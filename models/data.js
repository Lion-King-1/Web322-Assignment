
module.exports.getAllMeals=function(mealdata)
{
  let categories=[];

  for (i = 0; i < mealdata.length; i++)
  {
    let currentData = mealdata[i];
    let categoryName = currentData.category;

    let category = categories.find((c) => c.category == categoryName);

    if (!category) {
      category = {
         category: categoryName,
         items: []
         };
      categories.push(category);
    }
    category.items.push(currentData);
  }
  // console.log(categories);
  return categories;
};

module.exports.getTopMeals = function (mealdata) {
  var filter = [];
  for (let i = 0; i < mealdata.length; i++) {
    if (mealdata[i].Top_Meal) filter.push(mealdata[i]);
  }
  return filter;
};