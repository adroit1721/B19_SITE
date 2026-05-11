import { configureStore } from '@reduxjs/toolkit';
import authReducer    from '../features/auth/authSlice';
import eventReducer   from '../features/events/eventSlice';
import galleryReducer from '../features/gallery/gallerySlice';
import blogReducer    from '../features/blogs/blogSlice';
import footerReducer  from '../features/footer/footerSlice';
import aboutReducer   from '../features/about/aboutSlice';
import settingsReducer from '../features/settings/settingsSlice';
import memberReducer   from '../features/members/memberSlice';

export const store = configureStore({
  reducer: {
    auth:    authReducer,
    events:  eventReducer,
    gallery: galleryReducer,
    blogs:   blogReducer,
    footer:  footerReducer,
    about:   aboutReducer,
    settings: settingsReducer,
    members:  memberReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
