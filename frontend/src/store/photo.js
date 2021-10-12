import { csrfFetch } from "./csrf"
const LOAD_PHOTOS = 'photos/loadPhotos'
const ADD_PHOTOS = 'photos/addPhotos'
const SET_PHOTOS = 'photos/setPhotos'

const loadPhotos = (photos) => ({
    type: LOAD_PHOTOS,
    photos,
})

const addPhoto = (photo) => ({
    type: ADD_PHOTOS,
    photo,
})

const setPhotos = (photo) => ({
    type: SET_PHOTOS,
    photo
})


export const getPhotos = () => async (dispatch) => {
    const reponse = await fetch('/api/photos')
    const photos = await reponse.json();
    dispatch(loadPhotos(photos))
}

export const uploadPhotos = (payload) => async (dispatch) => {
    const response = await csrfFetch('http://localhost:3000/api/photos', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
});
const photo = await response.json();
dispatch(addPhoto(photo));
return photo;
};


const initialState = {
};

const photoReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_PHOTOS:
            let newState = {...state};
            action.photos.forEach(photo => {
                newState[photo.id] = photo;
            });
            return newState;
        case ADD_PHOTOS:
            if (!state[action.photo.id]) {
                const newState = {
                    ...state,
                    [action.photo.id]: action.photo
                };
                return newState
            }
            return {
                ...state,
                [action.photo.id]: {
                    ...state[action.photo.id],
                    ...action.photo,
                }
            }
        // case SET_PHOTOS:
        //     newState = {...state}
        //     newState.photo = action.payload;
        default:
        return state;
    }
}


export default photoReducer
