import { IResponse } from '@app/common/response/interfaces/response.interface';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'src/common/response/decorators/response.decorator';
import { ApiKeyProtected } from 'src/modules/api-key/decorators/api-key.decorator';
import { CountryPublicListDoc } from 'src/modules/country/docs/country.public.doc';
import { CountryListResponseDto } from 'src/modules/country/dtos/response/country.list.response.dto';
import { CountryDoc } from 'src/modules/country/repository/entities/country.entity';
import { CountryService } from 'src/modules/country/services/country.service';

@ApiTags('modules.public.country')
@Controller({
    version: '1',
    path: '/country',
})
export class CountryPublicController {
    constructor(
        private readonly countryService: CountryService,
    ) { }

    @CountryPublicListDoc()
    @Response('country.all')
    @ApiKeyProtected()
    @Get('/all')
    async list(): Promise<IResponse<CountryListResponseDto[]>> {
        const countries: CountryDoc[] = await this.countryService.findAll();
        const mapped: CountryListResponseDto[] =
            this.countryService.mapList(countries);

        return { data: mapped };
    }
}
