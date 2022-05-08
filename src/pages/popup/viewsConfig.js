export const mainPanelForm = [
  {
    label: "文件类型",
    prop: "fileTypeCheckList",
    component: 'exCheckBoxGroup',
    options: [{ label: ".zip" }, { label: ".jpg.png.jpeg" }],
    attrs: {}
  },
  {
    label: '价格范围',
    prop: 'price',
    component: 'exSwitchInput',
    
  }
]