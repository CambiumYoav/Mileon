import { ConstPath } from '../../constants/const_path';
import { TabAttributes } from '../filters/tabsGroup';
import { LegalRequestsFiltersEnum } from '../../constants/LegalRequestsFiltersEnum';
import { Icon } from '../icon';

export class LegalRequestsTypeFilters {
    Icons = ConstPath;

    public LegalRequestsTypeFilters: TabAttributes[] = [
        {
            disabled: true,
            text: LegalRequestsFiltersEnum.All,
            name: LegalRequestsFiltersEnum.All,
        },
        {
            disabled: true,
            text: LegalRequestsFiltersEnum.ConversionRequests,
            name: LegalRequestsFiltersEnum.ConversionRequests,
            imgSrc: this.Icons.REFRESH_SQUARE,
            id: '1',
        },
        {
            disabled: true,
            text: LegalRequestsFiltersEnum.JudgedRequests,
            name: LegalRequestsFiltersEnum.JudgedRequests,
            imgSrc: this.Icons.HAMMER,
            id: '4',
        },
        {
            disabled: true,
            text: LegalRequestsFiltersEnum.AppealRequests,
            name: LegalRequestsFiltersEnum.AppealRequests,
            imgSrc: this.Icons.BANK,
            id: '2',
        }
    ];

    public legalRequestsIcons: Icon[] = [
        {
            id: 1,
            src: this.Icons.REFRESH_SQUARE,
            displayName: 'הסבה'
        },
        {
            id: 4,
            src: this.Icons.HAMMER,
            displayName: 'להישפט'
        },
        {
            id: 2,
            src: this.Icons.BANK,
            displayName: 'ערעור'
        },
    ];
}