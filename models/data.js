var mealdata = [
  {
    Title: "Biryani",
    Includings: "Mixed rice, Chicken curry & mint",
    Description: "Spicy rice mixed with chicken curry and garnished with mint",
    Category: "Classic Dish",
    Price: "$11.99",
    CookTime: "2-hours",
    Servings: 4,
    Calory: 1135.92,
    Image_url: "/9.jpg",
    Top_Meal: true,
  },

  {
    Title: "Korma",
    Includings: "Meat & Vegetables",
    Description: "Rice Mixed with vegetable and Meat curry",
    Category: "Classic Dish",
    Price: "$10.99",
    CookTime: "1-hour",
    Servings: 3,
    Calory: 990,
    Image_url: "/10.jpg",
    Top_Meal: true,
  },

  {
    Title: "Chole Bhature",
    Includings: "Chickpeas & Puri",
    Description: "Special chickpeas veg dish with indian flavoured puri",
    Category: "Classic Dish",
    Price: "$8.99",
    CookTime: "45-minutes",
    Servings: 2,
    Calory: 427,
    Image_url: "/11.jpg",
    Top_Meal: true,
  },

  {
    Title: "Gulab Jamun",
    Includings: "Sweet balls & Sugar syrup",
    Description: "Milk-solid-sweet balls dipped in sugar syrup",
    Category: "Desert",
    Price: 4.99,
    CookTime: "12-minutes",
    Servings: 1,
    Calory: 125,
    Image_url: "/15.jpg",
    Top_Meal: false,
  },
  {
    Title: "Shahi Saag",
    Includings: "Green Saag & Spices",
    Description: "World best saag with spicy taste and garlic.",
    Category: "Classic Dish",
    Price: "$16.99",
    CookTime: "2-hour",
    Servings: 4,
    Calory: 1252,
    Image_url: "/14.jpg",
    Top_Meal: false,
  },
  {
    Title: "Sandesh",
    Includings: "Fluffy sweet balls, garnished with Pistachios",
    Description: "Special Bengali sweet dish, Diwali Special",
    Category: "Desert",
    Price: "$8.99",
    CookTime: "15-minutes",
    Servings: 4,
    Calory: 150-200,
    Image_url: "/23.jpg",
    Top_Meal: false,
  },
  {
    Title: "Rasmalai",
    Includings: "spongy rasgulla with smooth cream",
    Description: "spongy rasgulla swimming in a silky smooth cream perfumed with almonds, pistachios, saffron and cardamom",
    Category: "Desert",
    Price: "$10.99",
    CookTime: "30-minutes",
    Servings: 2,
    Calory: 220,
    Image_url: "/24.jpg",
    Top_Meal: false,
  },
  {
    Title: "Jalebi",
    Includings: "Funnel cakes dipped in sugar syrup",
    Description: "Fried, crispy and sugar-coated funnel cake. Famous for sweet texture",
    Category: "Desert",
    Price: "$7.99",
    CookTime: "30-minutes",
    Servings: 2,
    Calory: 150,
    Image_url: "/25.jpg",
    Top_Meal: false,
  }
];

function MealTeller(val) {
  let F_arr = [];
  if (val == "Classic Dish") {
    for (let i = 0; i < mealdata.length; i++) {
      if (mealdata[i].Category == val) F_arr.push(mealdata[i]);
    }
  } else {
    let z_arr = [];
    for (let i = 0; i < mealdata.length; i++) {
      if (mealdata[i].Category == val) F_arr.push(mealdata[i]);
    }
  }
  return F_arr;
}

module.exports.getAllMeals = function () {
  let combine = [];
  combine = [
    {
      design: "Classic Dish",
      array: MealTeller("Classic Dish"),
    },
    {
      design: "Desert",
      array: MealTeller("Desert"),
    },
  ];

  return combine;
};

module.exports.getTopMeals = function () {
  var filter = [];
  for (let i = 0; i < mealdata.length; i++) {
    if (mealdata[i].Top_Meal) filter.push(mealdata[i]);
  }
  return filter;
};
