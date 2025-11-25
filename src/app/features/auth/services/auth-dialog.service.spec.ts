import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import { firstValueFrom, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { JwtService } from '../../../core/services/jwt.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthPayload, LoginResponse, RegisterResponse } from '../models/auth-dialog.model';
import { API_PATHS_TOKEN, ApiPaths } from './../../../core/config/api-paths.config';
import { AuthDialogService } from './auth-dialog.service';
describe('AuthDialogService', () => {
  let httpMock: HttpTestingController;
  let service: AuthDialogService;
  let apiPaths: ApiPaths;
  let notificationService: NotificationService;
  let jwtService: JwtService;
  let authService: AuthService;
  let notifySuccessSpy: jasmine.Spy<NotificationService['notifySuccess']>;
  let notifyErrorSpy: jasmine.Spy<NotificationService['notifyError']>;
  const mockPayload: AuthPayload = {
    email: 'test@example.invalid',
    password: 'StrongP@ssword-_123',
  };
  const mockErrorResponse = { status: 500, statusText: 'Internal server error' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        provideTranslateService(),
        AuthDialogService,
        NotificationService,
        AuthService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthDialogService);
    apiPaths = TestBed.inject(API_PATHS_TOKEN);
    notificationService = TestBed.inject(NotificationService);
    jwtService = TestBed.inject(JwtService);
    authService = TestBed.inject(AuthService);
    notifySuccessSpy = spyOn(notificationService, 'notifySuccess').and.returnValue(of('done'));
    notifyErrorSpy = spyOn(notificationService, 'notifyError');

  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('register', () => {
    const registerMockResponse: RegisterResponse = {
      message: 'created',
      user: {
        id: '1',
        email: 'test@example.invalid',
      },
    };
    const registerNotificationPrefix = 'auth.register';

    it('should send POST request to /register', async () => {
      const promise = firstValueFrom(service.register(mockPayload));
      const req = httpMock.expectOne(req =>
        req.url === apiPaths.AUTH.REGISTER &&
        req.method === 'POST'
      );
      expect(req.request.body).toEqual(mockPayload);
      req.flush(registerMockResponse);
      await expectAsync(promise).toBeResolvedTo(jasmine.objectContaining(registerMockResponse));
    });

    it('should call once notifySuccess', async () => {
      const promise = firstValueFrom(service.register(mockPayload));
      const req = httpMock.expectOne(apiPaths.AUTH.REGISTER);
      req.flush(registerMockResponse);
      await promise;
      expect(notifySuccessSpy)
        .withContext('notify success called once')
        .toHaveBeenCalledOnceWith(registerNotificationPrefix);
    });

    it('should handle POST request error', async () => {
      const promise = firstValueFrom(service.register(mockPayload));
      httpMock
        .expectOne(apiPaths.AUTH.REGISTER)
        .flush('User already exists', mockErrorResponse);
      await expectAsync(promise).toBeRejected();
    });

    it('should call once notifyError', (done) => {
      service.register(mockPayload).subscribe(
        {
          error: () => {
            expect(notifyErrorSpy)
              .withContext('notify error called once')
              .toHaveBeenCalledOnceWith(registerNotificationPrefix);
            done();
          }
        }
      )
      httpMock
        .expectOne(apiPaths.AUTH.REGISTER)
        .flush('User already exists', mockErrorResponse);
    });
  });
  describe('login', () => {
    const mockLoginResponse: LoginResponse = {
      userId: '1',
      email: 'test@invalid.invalid',
      accessToken: 'test-access-token',
    };
    const loginNotificationPrefix = 'auth.login';
    it('should send POST request to /login', async() => {
     const promise = firstValueFrom(service.login(mockPayload));
      httpMock
        .expectOne(req =>
          req.url === apiPaths.AUTH.LOGIN &&
          req.method === 'POST'
        )
        .flush(mockLoginResponse);
      await expectAsync(promise).toBeResolved();
    });
    it('should save accessToken, setCurrentUser and set auth visibility to false', async () => {
      const saveTokenSpy = spyOn(jwtService, 'saveToken');
      const setCurrentUserSpy = spyOn(authService, 'setCurrentUser');
      const setAuthVisibilitySpy = spyOn(authService, 'setAuthVisibility');
      service.login(mockPayload).subscribe();
      httpMock
        .expectOne(apiPaths.AUTH.LOGIN)
        .flush(mockLoginResponse);
      expect(saveTokenSpy)
        .withContext('save token once')
        .toHaveBeenCalledOnceWith(mockLoginResponse.accessToken);
      expect(setCurrentUserSpy)
        .withContext('set current user once')
        .toHaveBeenCalledOnceWith({
          email: mockLoginResponse.email,
          userId: mockLoginResponse.userId,
        });
      expect(setAuthVisibilitySpy)
        .withContext('set to false once')
        .toHaveBeenCalledOnceWith(false);
    });
    it('should notify success once', () => {
      service.login(mockPayload).subscribe();
      httpMock
        .expectOne(apiPaths.AUTH.LOGIN)
        .flush(mockLoginResponse);
      expect(notifySuccessSpy)
        .withContext('notify success once')
        .toHaveBeenCalledOnceWith(loginNotificationPrefix);
    });
    it('should handle login error and notifyError once', (done) => {
      service.login(mockPayload).subscribe({
        error: () => {
          expect(notifyErrorSpy)
            .withContext('notify an error once')
            .toHaveBeenCalledOnceWith(loginNotificationPrefix);
          done();
        }
      });
      httpMock
        .expectOne(apiPaths.AUTH.LOGIN)
        .flush("invalid payload", mockErrorResponse);
    });
  });
});