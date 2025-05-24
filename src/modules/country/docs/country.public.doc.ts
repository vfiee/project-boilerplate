import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { CountryListResponseDto } from 'src/modules/country/dtos/response/country.list.response.dto';

export function CountryPublicListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'get all list country' }),
        DocAuth({ xApiKey: true }),
        DocResponse<CountryListResponseDto>('country.all', {
            dto: CountryListResponseDto,
        })
    );
}
