import {CRUD} from "../../common/interfaces/crud.interface";
import {CreateCoachingRequestDto} from "../dtos/create.coaching.request.dto";
import {toCoachingRequestResponseDto} from "../dtos/dto.mapper";
import CoachingRequestsDao from "../daos/coaching.requests.dao";
import WeeklyCoachingRequestsDao from "../../weeklyCoachingRequests/daos/weekly.coaching.request.dao";
import debug from "debug";
import {ListCoachingRequestsDto} from "../dtos/list.coaching.requests.dto";
import {PatchCoachingRequestDto} from "../dtos/patch.coaching.request.dto";
import {ICoachingRequestModel} from "../models/coaching.request.model";
import {PagedData} from "../../common/interfaces/paged.data";
import {CoachingRequestResponseDto} from "../dtos/coaching.request.response.dto";
import {CoachingRequestExistDto} from "../dtos/coaching.request.exist.dto";

const log: debug.IDebugger = debug('app:coaching-requests-service');

class CoachingRequestsService implements CRUD {

    /**
     * Creates a new CoachingRequest
     * @param resource
     */
    async create(resource: CreateCoachingRequestDto): Promise<CoachingRequestResponseDto> {
        try {
            log(`create request`, resource);
            const newRequest: ICoachingRequestModel = await CoachingRequestsDao.createRequest(resource);

            log(`create add to WeeklyCoachingRequests ${newRequest.id}`);
            await WeeklyCoachingRequestsDao.addCoachingRequest(newRequest);

            return toCoachingRequestResponseDto(newRequest);
        } catch (e) {
            log(e);
            throw e;
        }
    }


    //todo must also delete from WeeklyRequests
    /**
     * Attempts to delete the specified CoachingRequest by id. If the deletion was successful, the deleted document
     * is returned (as a DTO), if the CoachingRequest was not found, null is returned
     * @param id
     */
    async deleteById(id: string): Promise<CoachingRequestResponseDto | null> {
        try {
            const deletedReq = await CoachingRequestsDao.removeRequestById(id);
            if (deletedReq) {
                log(`deleteById ${id} deleted`);
                return toCoachingRequestResponseDto(deletedReq);
            } else {
                log(`deleteById ${id} NOT FOUND`);
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }


    /**
     * returns a page of CoachingRequest data within a ListCoachingRequestDto. The data will be empty if the requested
     * page exceeds the maximum page.
     * @param queryParams
     */
    async list(queryParams: any): Promise<ListCoachingRequestsDto> {
        try {
            log(`list coaching requests`);
            const requests: PagedData<ICoachingRequestModel> =  await CoachingRequestsDao.getRequests(queryParams);
            const responses: Array<CoachingRequestResponseDto> = requests.data.map((r: ICoachingRequestModel) => toCoachingRequestResponseDto(r));
            return {
                ...requests,
                data: responses,
            };
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * Patches a CoachingRequest with the data contained in resource.
     * Returns the old, pre-patched document if the patch was successful.
     * @param id - the db ID of the CoachinRequest to PATCH
     * @param resource - contains the properties to patch in a CoachingRequest
     * @throws ApiError if the requestId or the coachId was not found, a 404 code is thrown.
     * If a validation error occurred, a 400 code is thrown.
     * If some other DB error occurred, a 500 code is thrown
     */
    async patchById(id: string, resource: PatchCoachingRequestDto): Promise<CoachingRequestResponseDto> {
        try {
            log(`patchById ${id}`, resource);
            const patchedCoachingRequest = await CoachingRequestsDao.patchRequestById(id, resource);
            return toCoachingRequestResponseDto(patchedCoachingRequest);
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * Puts (overwrites) an existing CoachingRequest with the properties in the resource object
     * @param id - primary id of the coaching request to update
     * @param resource - object that contains the Request fields to update
     * @throws ApiError if the requestId or the coachId was not found, a 404 code is thrown.
     * If a validation error occurred, a 400 code is thrown.
     * If some other DB error occurred, a 500 code is thrown
     */
    async putById(id: string, resource: CreateCoachingRequestDto): Promise<CoachingRequestResponseDto> {
        try {
            log(`putById ${id}`, resource);
            const savedReq: ICoachingRequestModel =  await CoachingRequestsDao.putRequestById(id, resource);
            return toCoachingRequestResponseDto(savedReq);
            // todo will also need to delete the specific request for the old coach in weeklyRequests
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * Returns a CoachingRequest that matches the specified id, if no matching request was found, null is returned
     * @param id
     */
    async readById(id: string): Promise<CoachingRequestResponseDto | null> {
        try {
            log(`readById ${id}`);
            const coachingRequest = await CoachingRequestsDao.getRequestById(id);
            if (coachingRequest) {
                return toCoachingRequestResponseDto(coachingRequest);
            } else {
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * returns true if a coaching request with the specified id exists in the database, else false
     * @param id the request id to look up
     */
    async requestExists(id: string): Promise<CoachingRequestExistDto | null> {
        try {
            log(`exists ${id}`);
            return await CoachingRequestsDao.requestExists(id);
        } catch (e) {
            log(e);
            throw e;
        }
    }
}

export default new CoachingRequestsService();