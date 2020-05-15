import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    Root: {
      path: 'root',
      screens: {
        AllReviews: 'AllReviewScreen',
        EditReview: 'EditReviewScreen',
        AddNew: 'AddNewScreen',
        Login: 'LoginScreen',
        ReviewMap: 'ReviewMapScreen',
        SignUp: 'SignUpScreen',
        SingleRecipe: 'SingleRecipeScreen',
        UserReview: 'UserReviewScreen'
      },
    },
  },
};
