import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { reqCaptch, getScore, checkCaptcha } from 'src/scripts/seleniumScript/request'

interface UserResponse<T = unknown> {
  code: number;
  data?: T
  message: string;
}

@Controller('captcha')
export class CaptchaController {
  @Get('getScore')
  async score(): Promise<UserResponse<any>> {
    const res = await getScore()
    console.log(res)
    return {
      code: 200,
      data: {
        tifen: res,
      },
      message: 'Success.',
    }
  }

  @Get('getCaptcha')
  async captcha(): Promise<UserResponse<any>> {
    const res = await checkCaptcha('./captcha.jpg')
    console.log(res)
    return {
      code: 200,
      data: {
        tifen: res,
      },
      message: 'Success.',
    }
  }
}
