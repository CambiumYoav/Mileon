import { MentionService } from '../../services/mention.service';
import { SystemFieldModuleEnum } from '../enum/systemFiledEnum';

export class CkEditorConfig {
  currentModuleId?: SystemFieldModuleEnum;
  public textFieldConfig = {
    licenseKey:
      'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjIxMjc5OTksImp0aSI6ImM2N2U1Mjg4LTg0ZGEtNGRjYy1iMTQwLWMxNmY2OTEwMWY2NCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjMxY2M1OGYzIn0.GGdvQT2r7DwL0EmjGbvTHwBxaKcYg_rYnDQhaw9XAbAx7ychmW3i3ZyFnbh_RAOSQmvxnCh2iQQILZbVQ7Fm4A',
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      '|',
      'fontSize',
      'fontFamily',
      '|',
      'outdent',
      'indent',
      '|',
      'alignment',
      '|',
      // List options
      'bulletedList',
      'numberedList',
      'todoList', // To-do list
      '|',
      'horizontalLine', // Horizontal line
      'pageBreak', // Page break
      '|',
      'undo',
      'redo',
      'insertTable',
      'findAndReplace',
      'importWord',
    ],
    // shouldNotGroupWhenFull: false,
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
    list: {
      properties: {
        styles: true, // Enable different bullet/number styles
        startIndex: true, // Enable custom start numbers
        reversed: true, // Enable reversed numbering
      },
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
    mention: {
      feeds: [
        {
          marker: '@',
          minimumCharacters: 0,
          dropdownLimit: 10, // נתאים ל-pageSize שנבקש מהשרת
          feed: (queryText: string) => this.fetchSystemFields(queryText),
          itemRenderer: (item: any) => this.renderMentionItem(item),
        },
      ],
    },
  };

  public templateTextConfig = {
    licenseKey:
      'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjIxMjc5OTksImp0aSI6ImM2N2U1Mjg4LTg0ZGEtNGRjYy1iMTQwLWMxNmY2OTEwMWY2NCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjMxY2M1OGYzIn0.GGdvQT2r7DwL0EmjGbvTHwBxaKcYg_rYnDQhaw9XAbAx7ychmW3i3ZyFnbh_RAOSQmvxnCh2iQQILZbVQ7Fm4A',
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
  };

  constructor(private mentions?: MentionService) {}

  private nameToGuid = new Map<string, string>(); // "displayName" -> "GUID"

  private async fetchSystemFields(queryText: string) {
    const page = 1;
    const pageSize = 20;
    if (this.mentions) {
      const res = await this.mentions.searchSystemFields(
        queryText || '',
        this.currentModuleId,
        page,
        pageSize
      );

      // Insert @displayName; keep GUID on the object for later
      return (res?.list ?? []).map((f) => {
        const displayName = String(f.displayName || '').trim();
        const guid = String(f.id || '').trim();

        // Pre-cache (helps save-time mapping)
        if (displayName && guid) this.nameToGuid.set(displayName, guid);

        return {
          id: '@' + guid, // MUST start with "@", and is what goes into content
          text: displayName, // what the dropdown shows
          guid, // keep for the select hook below
        };
      });
    }
    
    // Return empty array if mentions service is not available
    return [];
  }

  private renderMentionItem(item: any): HTMLElement {
    const el = document.createElement('span');
    el.classList.add('custom-mention');
    el.textContent = item?.text || '';
    return el;
  }

  onModuleChange(moduleId?: SystemFieldModuleEnum) {
    this.currentModuleId = moduleId;
  }
}
