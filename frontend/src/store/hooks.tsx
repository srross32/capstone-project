import { useDispatch as dispatch, useSelector as selector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useDispatch = dispatch.withTypes<AppDispatch>();
export const useSelector = selector.withTypes<RootState>();
