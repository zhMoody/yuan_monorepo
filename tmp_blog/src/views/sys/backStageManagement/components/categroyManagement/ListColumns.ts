import {h} from 'vue'
import {NButton, NPopconfirm} from 'naive-ui'
import type {DataTableColumns} from 'naive-ui'


export const createColumns = (
  {editCategroy}: { editCategroy: (rowData: CRowData.Data) => void },
  {deleteCategroy}: { deleteCategroy: (rowData: CRowData.Data) => void }
): DataTableColumns<CRowData.Data> => {
  return [
    {
      title: '分类id',
      key: '_id'
    },
    {
      title: '分类名',
      key: 'name'
    },
    {
      title: '关键字',
      key: 'keyword'
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return [h(
          NButton,
          {
            type: 'info',
            size: 'small',
            style: 'margin-right:10px',
            onClick: () => deleteCategroy(row)
          },
          {default: () => '编辑'}
        ),
          h(NPopconfirm, {
              positiveText: "确认",
              negativeText: '取消',
              onPositiveClick: () => editCategroy(row)
            }, {
              trigger: () => h(
                NButton,
                {
                  type: 'error',
                  size: 'small',
                },
                {default: () => '删除'}
              ),
              default: () => '确定要删除吗？',
            }
          )
        ]
      }
    }
  ]
}
