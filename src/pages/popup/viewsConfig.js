export const mainPanelForm = [
  {
    label: "时间范围",
    prop: "date",
    // component: "ElDatePicker",
    component: "exDateRangePick",
  },
  {
    label: "文件类型",
    prop: "fileTypeCheckList",
    component: "exCheckBoxGroup",
    attrs: { options: [{ label: ".zip" }, { label: ".jpg.png.jpeg.gif" }] },
  },
  {
    label: "价格范围",
    prop: "price",
    component: "exSwitchInput",
  },
  // {
  //   label: '设置命名规则',
  //   prop: 'nameRule',
  //   component: 'exFolderNameDrop'
  // }
];
