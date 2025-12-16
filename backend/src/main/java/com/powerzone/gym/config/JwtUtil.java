package com.powerzone.gym.config;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.text.ParseException;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${supabase.jwt.issuer}")
    private String issuer;

    @Value("${supabase.jwt.jwks-url}")
    private String jwksUrl;

    /**
     * Validates Supabase JWT and returns user_id (sub)
     */
    public String extractUserId(String token)
            throws ParseException, JOSEException {

        SignedJWT signedJWT = SignedJWT.parse(token);

        // 1️⃣ Verify signature using Supabase public key (JWKS)
        JWKSet jwkSet = JWKSet.load(new URL(jwksUrl));
        JWK jwk = jwkSet.getKeyByKeyId(signedJWT.getHeader().getKeyID());

        if (jwk == null) {
            throw new JOSEException("Invalid JWT key ID");
        }

        RSAKey rsaKey = jwk.toRSAKey();
        JWSVerifier verifier = new RSASSAVerifier(rsaKey.toRSAPublicKey());

        if (!signedJWT.verify(verifier)) {
            throw new JOSEException("JWT signature verification failed");
        }

        // 2️⃣ Validate claims
        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

        validateClaims(claims);

        // 3️⃣ Return Supabase user id (sub)
        return claims.getSubject();
    }

    private void validateClaims(JWTClaimsSet claims) {

        // Issuer check
        if (!issuer.equals(claims.getIssuer())) {
            throw new IllegalArgumentException("Invalid JWT issuer");
        }

        // Expiration check
        Date expiration = claims.getExpirationTime();
        if (expiration == null || expiration.toInstant().isBefore(Instant.now())) {
            throw new IllegalArgumentException("JWT expired");
        }

        // Optional: audience check (can be added later)
    }
}
