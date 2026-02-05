uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uTime;
uniform int uPlanetType; // 0=rocky, 1=gas giant, 2=ice giant, 3=earth-like
uniform vec3 uSunPosition;
uniform sampler2D uTexture;
uniform bool uUseTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

// Noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

vec3 getRockyPlanetColor(vec3 pos) {
  float noise = fbm(pos * 3.0, 5);
  float craters = pow(max(0.0, snoise(pos * 8.0)), 2.0) * 0.3;
  vec3 color = mix(uColor1, uColor2, noise * 0.5 + 0.5);
  color = mix(color, uColor1 * 0.7, craters);
  return color;
}

vec3 getGasGiantColor(vec3 pos) {
  // Horizontal bands
  float bands = sin(pos.y * 15.0 + snoise(pos * 2.0) * 2.0) * 0.5 + 0.5;
  float turbulence = fbm(pos * 4.0 + vec3(uTime * 0.01, 0.0, 0.0), 4);

  vec3 color = mix(uColor1, uColor2, bands);
  color = mix(color, uColor3, turbulence * 0.3 + 0.2);

  // Great red spot style feature
  float spotNoise = snoise(pos * 3.0 + vec3(0.0, 0.0, uTime * 0.005));
  if (spotNoise > 0.6) {
    color = mix(color, uColor3 * 1.2, (spotNoise - 0.6) * 2.0);
  }

  return color;
}

vec3 getIceGiantColor(vec3 pos) {
  float bands = sin(pos.y * 8.0) * 0.5 + 0.5;
  float clouds = fbm(pos * 5.0 + vec3(uTime * 0.02, 0.0, 0.0), 4);

  vec3 color = mix(uColor1, uColor2, bands * 0.5);
  color = mix(color, uColor3, clouds * 0.2);

  return color;
}

vec3 getEarthLikeColor(vec3 pos) {
  float continents = fbm(pos * 2.0, 5);
  float detail = fbm(pos * 8.0, 3);

  // Ocean vs land
  vec3 oceanColor = uColor1;
  vec3 landColor = uColor2;
  vec3 mountainColor = uColor3;

  vec3 color;
  if (continents < 0.0) {
    // Ocean
    color = mix(oceanColor * 0.8, oceanColor, detail * 0.5 + 0.5);
  } else {
    // Land
    float elevation = continents + detail * 0.2;
    color = mix(landColor, mountainColor, smoothstep(0.2, 0.5, elevation));
  }

  // Ice caps
  float latitude = abs(pos.y);
  if (latitude > 0.85) {
    color = mix(color, vec3(0.95, 0.95, 1.0), smoothstep(0.85, 0.95, latitude));
  }

  return color;
}

void main() {
  vec3 spherePos = normalize(vWorldPosition);

  vec3 surfaceColor;

  if (uUseTexture) {
    // Use texture map
    surfaceColor = texture2D(uTexture, vUv).rgb;
  } else if (uPlanetType == 0) {
    surfaceColor = getRockyPlanetColor(spherePos);
  } else if (uPlanetType == 1) {
    surfaceColor = getGasGiantColor(spherePos);
  } else if (uPlanetType == 2) {
    surfaceColor = getIceGiantColor(spherePos);
  } else {
    surfaceColor = getEarthLikeColor(spherePos);
  }

  // Lighting from sun
  vec3 lightDir = normalize(uSunPosition - vWorldPosition);
  float diff = max(dot(vNormal, lightDir), 0.0);

  // Ambient light
  float ambient = 0.15;

  // Combine lighting
  vec3 finalColor = surfaceColor * (ambient + diff * 0.85);

  // Subtle rim lighting
  vec3 viewDir = normalize(-vPosition);
  float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
  finalColor += surfaceColor * rim * 0.1;

  gl_FragColor = vec4(finalColor, 1.0);
}
