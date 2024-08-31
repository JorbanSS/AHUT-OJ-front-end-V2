export interface NavItemType {
  title: string,                  // 显示名称
  icon: any,                      // 图标
  to?: { name: string },          // 路由
  subItems?: Array<NavItemType>,  // 子项
  [item: string]: any,            // 其他属性
}