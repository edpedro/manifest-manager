import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStarty extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY || 'defaultSecretKey',
    });
  }

  async validate(paload: any) {
    return {
      id: paload.id,
      first_name: paload.first_name,
      last_name: paload.last_name,
      username: paload.username,
      type: paload.type,
    };
  }
}
