// import { TabsGroupComponent } from './../../components/shared/tabs-group/tabs-group.component';
import { ROUTE_PATH } from '../../constants/routerPath';
import { SubModuleNames } from '../enum/moduleEnum';
import { TabAttributes } from '../filters/tabsGroup';

export class ManagementMain {
  public static Tabs: TabAttributes[] = [
    {
      disabled: null,
      text: SubModuleNames.AuthoritySettings,
      url: `${ROUTE_PATH.Management.Authority}`,
      name: 'authoritySettings',
      id: '1',
    },
    {
      disabled: null,
      text: SubModuleNames.LettersSettings,
      url: `${ROUTE_PATH.Management.TextTemplates}`,
      name: 'authoritySettings',
      id: '2',
    },
    {
      disabled: null,
      text: SubModuleNames.PortalSettings,
      url: `${ROUTE_PATH.Management.Portal}`,
      name: 'portalSettings',
      id: '3',
    },
    {
      disabled: null,
      text: SubModuleNames.FormsSettings,
      url: `${ROUTE_PATH.Management.FormsManagement}`,
      name: 'authoritySettings',
      id: '4',
    },
  ];

  public static TemplatesTabs: TabAttributes[] = [
    {
      disabled: null,
      text: SubModuleNames.TemplatesText,
      url: `text`,
      name: 'authoritySettings',
      id: '1',
    },
    {
      disabled: null,
      text: SubModuleNames.TemplatesLogo,
      url: `logo`,
      name: 'authoritySettings',
      id: '2',
    },
    {
      disabled: null,
      text: SubModuleNames.TemplatesSignature,
      url: `signature`,
      name: 'portalSettings',
      id: '3',
    },
  ];
}
