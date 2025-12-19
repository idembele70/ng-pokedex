import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideTranslateService } from "@ngx-translate/core";
import { provideToastr } from "ngx-toastr";
import { firstValueFrom } from "rxjs";
import { API_PATHS_TOKEN, ApiPaths } from "../config/api-paths.config";
import { CurrentUser } from "../models/auth.model";
import { AuthService } from "./auth.service";

let service: AuthService;
let httpMock: HttpTestingController;
let apiPaths: ApiPaths;
describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        provideTranslateService(),
      ],
    });
    service = TestBed.inject(AuthService);
    apiPaths = TestBed.inject(API_PATHS_TOKEN);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initAuth', () => {
    it('should auth user if /ME request succeeds', async () => {
      const mockUser: CurrentUser = {
        userId: '1df12',
        email: 'test-user@invalid.invalid',
      };
      const promise = firstValueFrom(service.initAuth());
      httpMock
        .expectOne(req =>
          req.url === apiPaths.AUTH.ME &&
          req.method === 'GET'
        )
        .flush(mockUser);
        await expectAsync(promise).toBeResolvedTo(
          jasmine.objectContaining(mockUser)
        );
        expect(service.currentUser()).toEqual(mockUser);
        expect(service.isLoggedIn()).toBeTrue();
    });

    it('should handle initAuth error', async () => {
      const mockErrorResponse = {
        statusText: 'Unauthorized',
        status: 401,
      };
      const promise = firstValueFrom(service.initAuth());
      httpMock
        .expectOne(apiPaths.AUTH.ME)
        .flush({ message: 'token expired' }, mockErrorResponse);
      await expectAsync(promise).toBeRejectedWith(
        jasmine.objectContaining(
          mockErrorResponse,
        ),
      );
      expect(service.currentUser()).toBeNull();
      expect(service.isLoggedIn()).toBeFalse();
    });
  });
});