export const mainPanelForm = [
  {
    label: "文件类型",
    prop: "fileTypeCheckList",
    component: 'exCheckBoxGroup',
    attrs: { options: [{ label: ".zip" }, { label: ".jpg.png.jpeg" }] }
  },
  {
    label: '价格范围',
    prop: 'price',
    component: 'exSwitchInput',
  },
  {
    label: '时间范围',
    prop: 'date',
    component: 'ElDatePicker',
    attrs: {
      type: 'daterange',
      'value-format': 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: '设置命名规则',
    prop: 'nameRule',
    component: 'exFolderNameDrop'
  }
]