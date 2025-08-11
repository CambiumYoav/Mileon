export class CkEditorConfig {
  public textFieldConfig = {
    licenseKey:
      'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTU1NjE1OTksImp0aSI6ImEwMGU2OTNmLTBiNWMtNDExNC04NzA3LWRjZDY4YmFjZjFkYiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImM2ZDJjM2NmIn0.d88fY5y3jj8AHY6vsmaSKJhVkp0sZoeTdLz8ObjgAknVW4dlI4ObtJG_ovxs6WTTqZUoN1OuxxsPjh2C3NKZ5A', // שים את הרישיון האמיתי אם יש
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'importWord'],
    mention: {
      feeds: [
        {
          marker: '@',
          feed: [
            { id: '@barney', text: 'Barney Stinson' },
            { id: '@lily', text: 'Lily Aldrin' },
            { id: '@marry', text: 'Marry Ann' },
            { id: '@marshall', text: 'Marshall Eriksen' },
            { id: '@robin', text: 'Robin Scherbatsky' },
            { id: '@ted', text: 'Ted Mosby' },
          ],
          dropdownLimit: 5,

          itemRenderer: (item: any) => {
            const itemElement = document.createElement('span');
            itemElement.classList.add('custom-mention');
            itemElement.textContent = `${item.id} - ${item.text}`;
            return itemElement;
          },
        },
      ],
    },
    language: 'he',
  };

  public templateTextConfig = {
    licenseKey:
      'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTU1NjE1OTksImp0aSI6ImEwMGU2OTNmLTBiNWMtNDExNC04NzA3LWRjZDY4YmFjZjFkYiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImM2ZDJjM2NmIn0.d88fY5y3jj8AHY6vsmaSKJhVkp0sZoeTdLz8ObjgAknVW4dlI4ObtJG_ovxs6WTTqZUoN1OuxxsPjh2C3NKZ5A',
    // toolbar: ['heading', '|', 'bold', 'italic', '|'],
    toolbar: [
      'heading',
      '|',
      'bold', // הבלטה
      'italic', // קו נטוי
      'underline', // קו תחתון
      '|',
      'fontSize', // גודל גופן
      'fontFamily', // סוג גופן
      '|',
      'outdent', // הדחה החוצה
      'indent',
      // הדחה פנימה
      '|',
      'alignment', // יישור טקסט (כולל ימין, שמאל, אמצע)
      '|',
      'undo',
      'redo',
    ],
    fontSize: {
      options: [
        9,
        11,
        13,
        'default', // The 'default' option resets the font size
        17,
        19,
        21,
      ],
    },
    fontFamily: {
      options: [
        'default', // The 'default' option resets the font family
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
      ],
    },
    indentBlock: {
      offset: 40, // פיקסלים להזחה
      unit: 'px',
    },
    language: 'he',
    // Ensure you have the necessary plugins installed for all toolbar items.
    // For alignment, you might need to specify the options like this:
    alignment: {
      options: ['left', 'center', 'right', 'justify'],
    },
    // language: 'he',
  };
}
