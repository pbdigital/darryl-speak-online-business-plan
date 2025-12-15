import * as jose from 'jose';

export interface PowerAgentJwtPayload {
  sub: string; // WordPress user ID
  email: string;
  first_name: string;
  last_name: string;
  iat: number; // Issued at
  exp: number; // Expiration
}

export interface JwtValidationResult {
  valid: boolean;
  payload?: PowerAgentJwtPayload;
  error?: string;
}

/**
 * Validates a JWT token from the Power Agent SSO WordPress plugin.
 * Uses HS256 (HMAC-SHA256) algorithm with a shared secret.
 */
export async function validatePowerAgentJwt(
  token: string
): Promise<JwtValidationResult> {
  const secret = process.env.POWER_AGENT_JWT_SECRET;

  if (!secret) {
    console.error('POWER_AGENT_JWT_SECRET is not configured');
    return {
      valid: false,
      error: 'SSO is not properly configured',
    };
  }

  try {
    // Encode the secret for jose library
    const secretKey = new TextEncoder().encode(secret);

    // Verify the JWT
    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    // Validate required fields
    if (!payload.sub || !payload.email) {
      return {
        valid: false,
        error: 'Invalid token payload',
      };
    }

    return {
      valid: true,
      payload: {
        sub: String(payload.sub),
        email: String(payload.email),
        first_name: String(payload.first_name || ''),
        last_name: String(payload.last_name || ''),
        iat: Number(payload.iat),
        exp: Number(payload.exp),
      },
    };
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      return {
        valid: false,
        error: 'Token has expired',
      };
    }

    if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      return {
        valid: false,
        error: 'Invalid token signature',
      };
    }

    console.error('JWT validation error:', error);
    return {
      valid: false,
      error: 'Token validation failed',
    };
  }
}
