import { Injectable, signal, computed, inject } from '@angular/core';
import { Municipal } from '../types/municipal';
import { ConstPath } from '../constants/const_path';
import { PermissionService } from './permission.service';
import { LookupNewService } from './lookup-new.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthorityService {
  private permission = inject(PermissionService);
  private lookup = inject(LookupNewService);

  // --- constants / defaults ---
  private readonly SUPER_ID = '11111111-1111-1111-1111-111111111111';

  superAdminMunicipal: Municipal = {
    name: 'Mview',
    tasks: 2,
    logo: ConstPath.LOGO_MVIEW,
    authorityID: this.SUPER_ID,
  };

  mock: Municipal[] = [
    {
      name: 'אשדוד',
      tasks: 2,
      logo: ConstPath.ASHKELON_LOGO,
      authorityID: '9d24f102-dbcc-49bc-8258-0b58af257b89',
    },
    {
      name: 'באר-שבע',
      tasks: 12,
      logo: ConstPath.BEER_SHEVA_LOGO,
      authorityID: 'DBB82D52-779E-467B-96F4-FF4237299511',
    },
    {
      name: 'ערד',
      tasks: 0,
      logo: ConstPath.CAMBIUM_LOGO,
      authorityID: '9fdda9ea-2fa6-42e2-9593-b382c3fbcd43',
    },
    this.superAdminMunicipal,
  ];

  // --- signals (state) ---
  private _authorityId = signal<string | null>(this.getStoredAuthorityID());
  private _currentMunicipal = signal<Municipal | null>(null);
  private _municipals = signal<Municipal[]>([]);
  private _nationalAdminMode = signal<boolean>(false);

  // --- public readonly signals ---
  authorityId = this._authorityId.asReadonly();
  currentMunicipal = this._currentMunicipal.asReadonly();
  municipals = this._municipals.asReadonly();
  nationalAdminMode = this._nationalAdminMode.asReadonly();

  // --- derived/computed ---
  hasMunicipals = computed(() => this._municipals().length > 0);
  isSuperAdmin = computed(
    () =>
      (this.permission.authority() ?? this.permission.authority?.()) ===
      this.SUPER_ID
  );

  // --- optional observables for legacy consumers ---
  authorityId$ = toObservable(this.authorityId);
  currentMunicipal$ = toObservable(this.currentMunicipal);
  municipals$ = toObservable(this.municipals);

  // ---------- storage ----------
  private getStoredAuthorityID(): string | null {
    return sessionStorage.getItem('currentAuthorityID');
  }

  private persistAuthority(id: string) {
    sessionStorage.setItem('currentAuthorityID', id);
    localStorage.setItem('selectedAuthority', JSON.stringify(id));
  }

  // ---------- mutations ----------
  setAuthorityID(authorityID: string) {
    if (this._authorityId() !== authorityID) {
      this._authorityId.set(authorityID);
      this.persistAuthority(authorityID);
    }
  }

  saveSelectedAuthority(m: Municipal) {
    if (!m) return;
    if (this._currentMunicipal()?.authorityID !== m.authorityID) {
      this._currentMunicipal.set(m);
    }
    this.setAuthorityID(m.authorityID);
  }

  async saveSelectedAuthorityById(authorityId: string) {
    let list = this._municipals();
    if (!list.find((x) => x.authorityID === authorityId)) {
      const res = await this.getMunicipals();
      list = res.list;
    }
    const matched = list.find((x) => x.authorityID === authorityId);
    if (matched) this._currentMunicipal.set(matched);
    this.setAuthorityID(authorityId);
  }

  setSuperAdminMunicipal() {
    this._currentMunicipal.set(this.superAdminMunicipal);
    this.setAuthorityID(this.superAdminMunicipal.authorityID);
  }

  setMunicipalsToNationalAdmin() {
    this._nationalAdminMode.set(true);
    const onlySuper = this.mock.filter(
      (m) => m.authorityID === this.superAdminMunicipal.authorityID
    );
    this._municipals.set(onlySuper);
    this.setSuperAdminMunicipal();
  }

  // setMunicipalsToNationalRegional() {
  //   this._nationalAdminMode.set(false);

  //   const userAuthority =
  //     this.permission.authority?.() ?? this.permission.authority?.() ?? '';

  //   const filtered = this._municipals().filter((m) =>
  //     userAuthority !== this.SUPER_ID
  //       ? m.authorityID === userAuthority
  //       : m.authorityID !== this.superAdminMunicipal.authorityID
  //   );

  //   const selectedId =
  //     userAuthority !== this.SUPER_ID ? userAuthority : this._authorityId();
  //   this._municipals.set(filtered);

  //   const selected =
  //     filtered.find((m) => m.authorityID === selectedId) ?? filtered[0];

  //   if (selected) this.saveSelectedAuthority(selected);
  // }
  // setMunicipalsToNationalRegional() {
  //   this._nationalAdminMode.set(false);

  //   // Get user authority - fix the double call
  //   const userAuthority = this.permission.authority?.() ?? '';

  //   // Get current municipals list
  //   const allMunicipals = this._municipals();

  //   // Filter logic:
  //   // - If NOT super admin: show only their authority
  //   // - If super admin: show all EXCEPT the super admin municipal
  //   const filtered = allMunicipals.filter((m) => {
  //     if (userAuthority !== this.SUPER_ID) {
  //       // Regular user: only show their authority
  //       return m.authorityID === userAuthority;
  //     } else {
  //       // Super admin: show all except super admin municipal
  //       return m.authorityID !== this.superAdminMunicipal.authorityID;
  //     }
  //   });

  //   // Determine which authority to select
  //   const selectedId =
  //     userAuthority !== this.SUPER_ID
  //       ? userAuthority
  //       : this._authorityId() ?? filtered[0]?.authorityID;

  //   console.log('Filtered Municipals:', filtered[0]);
  //   // Update municipals list
  //   this._municipals.set(filtered);

  //   // Find and set the selected municipal
  //   const selected =
  //     filtered.find((m) => m.authorityID === selectedId) ?? filtered[0];

  //   if (selected) {
  //     this.saveSelectedAuthority(selected);
  //   }
  // }
  setMunicipalsToNationalRegional() {
    this._nationalAdminMode.set(false);
  
    // Get user authority
    const userAuthority = this.permission.authority?.() ?? '';
    const isSpecificAuthority = userAuthority !== this.SUPER_ID;
  
    // Get current municipals list
    const allMunicipals = this._municipals();
    
    console.log('All Municipals before filter:', allMunicipals);
    console.log('User Authority:', userAuthority);
    console.log('Is Specific Authority:', isSpecificAuthority);
    
    // Filter logic matching your old Angular 13 code:
    // - If user has specific authority: show only that authority
    // - If user is super admin: show all EXCEPT super admin municipal (Mview)
    const filtered = isSpecificAuthority
      ? allMunicipals.filter((m) => m.authorityID === userAuthority)
      : allMunicipals.filter((m) => m.authorityID !== this.superAdminMunicipal.authorityID);
  
    console.log('Filtered Municipals:', filtered);
  
    // Update the municipals list
    this._municipals.set(filtered);
  
    // Determine which to select
    const currentStoredId = this._authorityId();
    const idToSelect = isSpecificAuthority ? userAuthority : currentStoredId;
    
    // Find the selected municipal
    const selected = filtered.find((m) => m.authorityID === idToSelect) ?? filtered[0];
  
    console.log('Selected Municipal:', selected);
  
    if (selected) {
      this.saveSelectedAuthority(selected);
    }
  }
  // ---------- queries ----------
  /** Fetch + enrich municipals and update signal.
   *  Returns the enriched list for imperative callers. */
  async getMunicipals(
    filter?: any
  ): Promise<{ list: Municipal[]; totalCount: number }> {
    const res: any = await this.lookup.getAuthoritiesForHeader(filter);
    const responseList = res?.list ?? [];
    const totalCount = res?.total ?? responseList.length;

    const enriched: Municipal[] = responseList.map((item: any) => {
      const match = this.mock.find(
        (m) => m.authorityID.toLowerCase() === item.authorityID.toLowerCase()
      );
      return {
        authorityID: item.authorityID,
        name: item.authorityName,
        logo: match?.logo || ConstPath.ASHKELON_LOGO,
        tasks: match?.tasks || 0,
      };
    });

    if (this._nationalAdminMode()) {
      const superId = this.superAdminMunicipal.authorityID.toLowerCase();
      const onlySuper = enriched.filter(
        (m) => m.authorityID.toLowerCase() === superId
      );
      this._municipals.set(onlySuper);
      return { list: onlySuper, totalCount: onlySuper.length };
    }

    this._municipals.set(enriched);
    return { list: enriched, totalCount };
  }

  // ---------- convenience getters (if you want same API as before) ----------
  getAuthorityID(): string {
    return this._authorityId() ?? '';
  }
}
