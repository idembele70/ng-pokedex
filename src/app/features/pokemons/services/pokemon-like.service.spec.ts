import { TestBed } from "@angular/core/testing";
import { PokemonLikeService } from "./pokemon-like.service";
import { LIKE_API_PATHS, LIKE_API_PATHS_TOKEN } from "../config/like-api-paths.config";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideToastr } from "ngx-toastr";
import { Pokemon } from "../models/pokemon.model";
import { LoaderService } from "../../../core/services/loader.service";
import { provideTranslateService } from "@ngx-translate/core";
import { NotificationService } from "../../../core/services/notification.service";

describe('PokemonLikeService', () => {
  let service: PokemonLikeService;
  let httpMock: HttpTestingController;
  let loaderService: LoaderService;
  let notificationService: NotificationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PokemonLikeService,
        {
          provide: LIKE_API_PATHS_TOKEN,
          useValue: LIKE_API_PATHS
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        provideTranslateService(),
      ],
    });
    service = TestBed.inject(PokemonLikeService);
    httpMock = TestBed.inject(HttpTestingController);
    loaderService = TestBed.inject(LoaderService);
    notificationService = TestBed.inject(NotificationService);
  });
  afterEach(() => {
    httpMock.verify();
  })

  describe('toggleLike', () => {
    const mockId: Pokemon['_id'] = '692486f93ed56d18b59dc29d';
    let setIsTogglingLikeSpy: jasmine.Spy<(state: boolean) => void>;
    let notifySuccessSpy: jasmine.Spy<(prefix: string) => void>;
    beforeEach(() => {
      setIsTogglingLikeSpy = spyOn(loaderService, 'setIsTogglingLike');
      notifySuccessSpy = spyOn(notificationService, 'notifySuccess').and.callThrough();
    });
    it('should add pokemon id to likeIds array', () => {
      service.toggleLike(mockId);
      expect(setIsTogglingLikeSpy).toHaveBeenCalledOnceWith(true);
      const req = httpMock.expectOne('likes/' + mockId);
      expect(req.request.method).toBe('POST');
      req.flush(true);
      expect(notifySuccessSpy).toHaveBeenCalledOnceWith('pokemons.notification.like')
      expect(setIsTogglingLikeSpy).toHaveBeenCalledWith(false);
      expect(setIsTogglingLikeSpy).toHaveBeenCalledTimes(2);
      expect(service.likedIds().size).toBe(1);
      expect(service.likedIds().has(mockId)).toBeTrue();
    });
    it('should remove pokemon id from likedIds array', () => {
      const id: Pokemon['_id'] = '692486f93ed56d18b59dc29d';
      service.toggleLike(id);
      const likeReq = httpMock.expectOne('likes/' + mockId);
      likeReq.flush(true);
      notifySuccessSpy.calls.reset();
      expect(service.likedIds().has(mockId)).toBeTrue();
      expect(service.likedIds().size).toBe(1);
      service.toggleLike(id);
      const dislikeReq = httpMock.expectOne('likes/' + mockId);
      expect(dislikeReq.request.method).toBe('DELETE');
      dislikeReq.flush(false);
      expect(notifySuccessSpy).toHaveBeenCalledOnceWith('pokemons.notification.dislike')
      expect(setIsTogglingLikeSpy).toHaveBeenCalledTimes(4);
      expect(setIsTogglingLikeSpy).toHaveBeenCalledWith(true);
      expect(setIsTogglingLikeSpy).toHaveBeenCalledWith(false);
      expect(service.likedIds().has(mockId)).toBeFalse();
      expect(service.likedIds().size).toBe(0);
    });
  });
  describe('getAllLike', () => {
    it('should return all liked pokemons', () => {
      const mockIds = [
        "692486f93ed56d18b59dc29d",
        "692486f93ed56d18b59dc29e",
      ];
      service.getAllLike();
      const req = httpMock.expectOne('likes');
      expect(req.request.method).toBe('GET');
      req.flush(mockIds);
      expect(service.likedIds().size).toBe(2);
    });
    it('should handle pokemons not found' , () => {
      const mockErrorResponse: Pick<HttpErrorResponse, 'status' | 'statusText'> = {
        status: 404,
        statusText: 'Not Found',
      };
      const notifyErrorSpy = spyOn(notificationService, 'notifyError').and.callThrough();
      service.getAllLike();
      const req = httpMock.expectOne('likes');
      req.flush('pokemons not found', mockErrorResponse);
      expect(notifyErrorSpy).toHaveBeenCalledOnceWith('pokemons.getAllLike');
    });
  });
});