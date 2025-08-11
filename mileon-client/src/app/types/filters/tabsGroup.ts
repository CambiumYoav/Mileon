export interface TabAttributes {
  text: string;
  name: string;
  imgSrc?: string;
  function?: Function;
  cssClass?: string;
  disabled: boolean | null;
  id?: string;
  url?: string;
  total?: number;
  permissionRoutes?: string[];
  isActive?: boolean;
  isMarked?:boolean;
}
