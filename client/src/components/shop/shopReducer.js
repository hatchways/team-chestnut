export default function shopReducer(state, action) {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        isMyShop: action.payload.user._id === action.user,
        shopData: {
          ...action.payload.shop,
          items: action.payload.shop.items.map(product => {
            return { ...product, isLiked: false };
          })
        },
        shopTitleInput: action.payload.shop.title,
        shopDescriptionInput: action.payload.shop.description
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case "PRODUCT_LIKED":
      return {
        ...state,
        shopData: {
          ...state.shopData,
          items: state.shopData.items.map((product, index) => {
            return index === action.likeIndex
              ? {
                  ...product,
                  isLiked: !product.isLiked
                }
              : product;
          })
        }
      };
    case "SHOP_DETAILS_UPDATE_SUCCESS":
      return {
        ...state,
        shopData: {
          ...state.shopData,
          title: action.data.title,
          description: action.data.description
        },
        editDetailsDialogOpen: false
      };
    case "SHOP_DETAILS_UPDATE_ERROR":
      return {
        ...state,
        shopDetailsUpdateError: action.error
      };
    case "SHOP_TITLE_INPUT":
      return {
        ...state,
        shopTitleInput: action.title
      };
    case "SHOP_DESCRIPTION_INPUT":
      return {
        ...state,
        shopDescriptionInput: action.description
      };
    case "OPEN_EDIT_DETAILS_DIALOG":
      return {
        ...state,
        editDetailsDialogOpen: true
      };
    case "CLOSE_EDIT_DETAILS_DIALOG":
      return {
        ...state,
        editDetailsDialogOpen: false
      };
    default:
      return null;
  }
}
