import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useDocumentTitle from '../../src/hooks/use-document-title';

// Route modules
import * as RootRoute from '../../src/root';
import * as IndexRoute from '../../src/routes/index/index';
import * as TourDetailRoute from '../../src/routes/tour-detail/tour-detail';
import * as PoiDetailRoute from '../../src/routes/point-of-interest-detail/point-of-interest-detail';
import * as RouteBuilderRoute from '../../src/routes/route-builder/route-builder';
import * as SignupRoute from '../../src/routes/signup/signup';
import * as LoginRoute from '../../src/routes/login/login';
import * as MyProfileRoute from '../../src/routes/my-profile/my-profile';
import * as MyFriendsRoute from '../../src/routes/my-profile/my-friends';
import * as MyToursRoute from '../../src/routes/my-profile/my-tours';
import * as MyGroupsRoute from '../../src/routes/my-profile/my-groups';
import * as MyNotificationsRoute from '../../src/routes/my-profile/my-notifications';
import * as MyPaymentsRoute from '../../src/routes/my-profile/my-payments';
import * as EditProfileRoute from '../../src/routes/my-profile/edit-profile';
import * as AdminUsersRoute from '../../src/routes/admin/user-management/user-management';
import * as AdminUserProfileRoute from '../../src/routes/admin/user-management/user-profile';
import * as AdminPoiRoute from '../../src/routes/admin/poi-management/poi-management';
import * as AdminBillingRoute from '../../src/routes/admin/billing';
import * as AdminProfileRoute from '../../src/routes/admin/admin-profile';
import * as AdminNotificationsRoute from '../../src/routes/admin/admin-notifications';
import * as AdminCreateRoute from '../../src/routes/admin/create-admin-account/create-admin-account';
import * as AdminAddPoiRoute from '../../src/routes/admin/create-poi/create-poi';
import * as AdminToursRoute from '../../src/routes/admin/tour-management';
import * as UnauthorizedRoute from '../../src/routes/error-routes/unauthorized';
import * as NotFoundRoute from '../../src/routes/error-routes/not-found';

describe('useDocumentTitle hook', () => {
    it('sets document.title when called', () => {
        renderHook(() => useDocumentTitle('Test Title | OptiTour'));
        expect(document.title).toBe('Test Title | OptiTour');
    });

    it('updates document.title when title prop changes', () => {
        const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
            initialProps: { title: 'First Title' },
        });
        expect(document.title).toBe('First Title');

        rerender({ title: 'Second Title' });
        expect(document.title).toBe('Second Title');
    });
});

describe('Route meta page titles', () => {
    const routeModules: [string, any][] = [
        ['Root', RootRoute],
        ['Index (Home)', IndexRoute],
        ['Tour Detail', TourDetailRoute],
        ['Point of Interest Detail', PoiDetailRoute],
        ['Route Builder', RouteBuilderRoute],
        ['Signup', SignupRoute],
        ['Login', LoginRoute],
        ['My Profile', MyProfileRoute],
        ['My Friends', MyFriendsRoute],
        ['My Tours', MyToursRoute],
        ['My Groups', MyGroupsRoute],
        ['My Notifications', MyNotificationsRoute],
        ['My Payments', MyPaymentsRoute],
        ['Edit Profile', EditProfileRoute],
        ['Admin Users', AdminUsersRoute],
        ['Admin User Profile', AdminUserProfileRoute],
        ['Admin POI Management', AdminPoiRoute],
        ['Admin Billing', AdminBillingRoute],
        ['Admin Profile', AdminProfileRoute],
        ['Admin Notifications', AdminNotificationsRoute],
        ['Admin Create Account', AdminCreateRoute],
        ['Admin Add POI', AdminAddPoiRoute],
        ['Admin Tours', AdminToursRoute],
        ['Unauthorized Error', UnauthorizedRoute],
        ['Not Found Error', NotFoundRoute],
    ];

    routeModules.forEach(([name, mod]) => {
        it(`${name} route defines a meta function returning a valid title containing OptiTour`, () => {
            expect(typeof mod.meta).toBe('function');
            const metaResult = mod.meta();
            expect(Array.isArray(metaResult)).toBe(true);

            const titleEntry = metaResult.find((item: any) => item && 'title' in item);
            expect(titleEntry).toBeDefined();
            expect(typeof titleEntry.title).toBe('string');
            expect(titleEntry.title.length).toBeGreaterThan(0);
            expect(titleEntry.title).toContain('OptiTour');
        });
    });
});
