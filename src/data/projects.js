export const projects = [
  {
    id: 'network-security-lab',
    title: 'Network Security Lab: Kali & Windows',
    featured: true,
    thumbnail: import.meta.env.BASE_URL + 'images/network-lab-1.png',
    shortDescription:
      'Isolated VirtualBox lab for practicing network reconnaissance and traffic interception with Nmap and Burp Suite.',
    tags: ['Networking', 'Nmap', 'Burp Suite', 'Python', 'VirtualBox'],
    sections: [
      {
        heading: '1. Network Configuration',
        body: `The lab environment consists of two virtual machines provisioned in Oracle VirtualBox: a Windows 10 guest and a Kali Linux guest. To enable direct communication between the two isolated from the host's production network, both VMs were attached to a Host-only Network adapter, creating a private /24 subnet (10.10.10.0/24) shared only between the guests (and optionally the host).

Static IP addresses were assigned manually to avoid relying on DHCP within the isolated segment:

Kali Linux (attacker/scanning host): 10.10.10.10
Windows 10 (target host): 10.10.10.20

On Linux, the address was applied at the interface level with ip addr add 10.10.10.10/24 dev eth0, followed by bringing the interface up (ip link set eth0 up). On Windows, the static IP was configured through the adapter's TCP/IPv4 properties. VirtualBox Guest Additions were also installed on the Kali guest (vboxguest kernel module confirmed loaded via lsmod) to enable clipboard sharing and shared folders for file transfer between host and guest during the exercise.

Connectivity between the two VMs was verified bidirectionally using ICMP (ping) prior to any service testing, confirming Layer 3 reachability across the host-only segment before layering application traffic on top.`,
        screenshots: [import.meta.env.BASE_URL + 'images/network-lab-1.png'],
      },
      {
        heading: '2. The Target Service — demo_service.py',
        body: `The service used as the scanning/interception target is a self-contained HTTP server built entirely on Python's standard library (http.server.BaseHTTPRequestHandler), with no external framework dependencies. It was written specifically to act as a controlled, safe target for practicing reconnaissance and traffic-inspection techniques, rather than as production code.

Key implementation details:

- Custom request handler (DemoHandler) overrides do_GET and do_POST, implementing a minimal manual router based on urlparse(self.path) — no routing framework, just conditional dispatch on the path.
- Structured logging — log_message is overridden to timestamp every incoming connection and log the client's address alongside the request, which is what produces the verbose access log visible in the terminal output.
- Exposed endpoints: GET / (index), GET /health (JSON status), GET|POST /login (echoes credentials, sets HttpOnly/SameSite cookie), GET /search?q= (reflects query param), GET /headers (echoes all received headers).
- Output encoding — every piece of user-controlled input is passed through html.escape() before being rendered, neutralizing reflected XSS on the /search and /login endpoints.
- Custom response headers (X-Demo-App: Day4-Kali-Windows-Demo, Server: TrainingHTTP/1.0) were added deliberately to make the service easy to fingerprint during scanning exercises.

The server was run interchangeably on either guest (py -3 demo_service.py on Windows, python3 demo_service.py on Kali) to test scanning from both directions across the host-only link.`,
        //screenshots: ['/images/network-lab-2.png','/images/network-lab-3.png', '/images/network-lab-4.png', '/images/network-lab-5.png', '/images/network-lab-6.png'],
      },
      {
        heading: '3. Reconnaissance Against the Service (Nmap)',
        body: `With the Windows guest (10.10.10.20) running demo_service.py and listening on port 8000, an Nmap service/version scan was launched from Kali:

nmap -sV 10.10.10.20
nmap -sV -p 8000 10.10.10.20

The -sV flag instructs Nmap to go beyond a simple port-state check and actively attempt service and version fingerprinting, sending protocol-specific probes and comparing responses against Nmap's signature database. This was visible directly in the server's live log:

- Non-HTTP protocol probes misdirected at the HTTP server: RTSP/1.0, SIP/2.0, TNMP, JRMI, GIOP (CORBA), MSSQLServer, NetBIOS/SMB negotiation frames (identifiable by the giveaway string Cookie: mstshash=nmap).
- Malformed HTTP requests: Bad HTTP/0.9 request type, Bad request syntax, and an unsupported OPTIONS method.
- A crashed connection (ConnectionAbortedError: [WinError 10053]) — Python's built-in http.server failing to gracefully handle a connection forcibly reset mid-probe, illustrating why http.server is documented as unsuitable beyond local testing.
- Legitimate HTTP fingerprint requests near the end: GET /nmaplowercheck..., POST /sdk, GET /HNAP1, GET /evox/about — checks for well-known device/management endpoints used to distinguish embedded web servers, media servers, or IoT devices.

The scan ultimately succeeded in fingerprinting the service, reporting:

8000/tcp open  http-alt  TrainingHTTP/1.0

Nmap correctly extracted the custom Server: TrainingHTTP/1.0 header and page title (Training Portal) from the response, and — since it didn't recognize the exact signature — output a submittable fingerprint block, standard behavior when a service doesn't exactly match an existing database entry.

Takeaway: this exercise demonstrates practical service enumeration methodology — observing not just that a port is open, but how active fingerprinting probes look at the packet/log level, and how a minimal, non-production HTTP server behaves under adversarial-style traffic.`,
        screenshots: ['/images/network-lab-6.png', '/images/network-lab-7.png', '/images/network-lab-8.png', '/images/network-lab-9.png'],
      },
      {
        heading: '4. Traffic Interception (Burp Suite)',
        body: `Separately, the same demo_service.py target was accessed through a browser configured to route traffic through Burp Suite Community Edition as an intercepting proxy (Proxy → Intercept). Four requests were captured and reviewed in the HTTP History and Inspector panels:

GET / — 0 query parameters
GET /login?campaign=mail-demo — 1 parameter (campaign)
GET /search?q=test — 1 parameter (q)
GET /headers — 0 query parameters

Burp's Inspector panel automatically decomposed each request into its structural components — method, path, protocol version, query parameters, body parameters, cookies, and headers (7 headers consistently present per request: Host, Accept-Language, Upgrade-Insecure-Requests, User-Agent, Accept, Accept-Encoding, Connection).

This confirms full visibility into client-to-server traffic at the application layer — every parameter a user (or script) supplies through the URL or a form is captured before it reaches the server, which is the foundation of manual web application testing: identifying every point where user-controlled input enters the application (here, campaign and q) so it can be manipulated and re-sent (e.g. via Burp Repeater) to test how the server-side code handles it. Since demo_service.py applies html.escape() to both parameters before reflecting them, the endpoints tested are not vulnerable to reflected XSS — a fact that could only be confirmed by first observing, via Burp, exactly which parameters reach the server unmodified.`,
        screenshots: ['/images/network-lab-2.png', '/images/network-lab-3.png', '/images/network-lab-4.png', '/images/network-lab-5.png'],
      },
    ],
    links: {
      github: '',
      demo: '',
    },
  },
  {
    id: 'des-elgamal-cryptography',
    title: 'Cryptographic Algorithms: DES, ElGamal, Lenstra ECM & Shamir',
    featured: false,
    thumbnail: import.meta.env.BASE_URL + 'images/des-1.png',
    shortDescription:
      "Python implementations of DES (with a meet-in-the-middle attack on Double DES), the ElGamal cryptosystem, Lenstra's elliptic curve factorization, and Shamir's secret sharing scheme.",
    tags: ['Cryptography', 'DES', 'ElGamal', 'RSA', 'Lenstra ECM', 'Shamir', 'Secret Sharing', 'Python', 'Symmetric Encryption', 'Public-Key Encryption'],
    sections: [
      {
        heading: '1. DES Structure — Permutation Tables',
        body: `This implementation builds DES from its core permutation tables rather than relying on a cryptography library, in order to demonstrate the algorithm's internal mechanics.

PC1 and PC2 drive the key schedule: PC1 compresses the original 64-bit key down to 56 bits (dropping the 8 parity bits), and PC2 compresses the rotated 56-bit key into each 48-bit round subkey. E is the expansion permutation, stretching the 32-bit right half of the block up to 48 bits so it can be XORed with the subkey. P is the final round permutation applied after substitution, responsible for diffusion across the block. IP and IP_INV are the initial and final bit permutations applied once at the very start and end of encryption — a legacy step from DES's original hardware design that provides no cryptographic strength on its own.

The SHIFT array (1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1) defines how many positions the two 28-bit key halves rotate left before each of the 16 rounds, which is what makes every round's subkey different.`,
        
      },
      {
        heading: '2. Key Schedule & Round Function',
        body: `generate_subkeys() applies PC1 to the input key, splits the result into two 28-bit halves, and rotates both halves left by the amount specified in SHIFT for each of the 16 rounds. After each rotation, the two halves are recombined and compressed through PC2 to produce that round's 48-bit subkey — this is the standard DES key schedule.

des_round() implements a single Feistel round: the 32-bit right half is expanded to 48 bits via E, XORed with the round subkey, passed through S-box substitution, and permuted through P before being XORed with the left half. In this implementation, sbox_substitution() is simplified to return the first 32 bits unchanged, rather than performing the real DES non-linear S-box lookups. This is an important simplification: the real S-boxes are what give DES its confusion and resistance to linear/differential cryptanalysis. Here, the round function is effectively linear, which makes the cipher considerably weaker than real DES and, as the attack results show, makes different keys collide to the same ciphertext.

des_encrypt_block() and des_decrypt_block() both apply the initial permutation IP, run the 16 Feistel rounds (decrypt simply applies the subkeys in reverse order — a core property of the Feistel structure), and finish with the final permutation IP_INV.`,
        
      },
      {
        heading: '3. Double DES and the Meet-in-the-Middle Attack',
        body: `des_encrypt_2des() / des_decrypt_2des() chain two independent DES operations with two separate keys (K1, K2) to build Double DES — an attempt to extend DES's 56-bit key to an effective 112 bits by applying it twice.

Double DES is famously vulnerable to a meet-in-the-middle (MITM) attack, and that's exactly what meet_in_the_middle_attack() demonstrates. Instead of brute-forcing the full 2^112 keyspace, the attack exploits the fact that ciphertext = E_K2(E_K1(plaintext)) can be rewritten as D_K2(ciphertext) = E_K1(plaintext). Both sides can be computed independently:

- Forward pass: encrypt the known plaintext under every candidate K1 and store each resulting intermediate value in a dictionary (forward_dict), keyed by the intermediate itself.
- Backward pass: decrypt the known ciphertext under every candidate K2, and check whether that intermediate value already exists in forward_dict.

A match means E_K1(plaintext) = D_K2(ciphertext), which recovers both keys. This reduces the attack from roughly 2^112 operations (brute-forcing both keys together) down to roughly 2 × |keyspace| operations plus a lookup — the classic time-memory tradeoff that breaks Double DES in practice (and is the reason real-world systems use Triple DES, 3DES, with three keys and a different EDE structure instead).

To keep the demo runnable, generate_special_keys() restricts the keyspace to 256 "repeated-byte" keys (each byte 0–255 repeated 8 times to fill 64 bits) instead of the full 2^56 DES keyspace — enough to prove the attack works without running for days.`,
        
      },
      {
        heading: '4. DES Results',
        body: `Running the script against a plaintext of 64 zero-bits, encrypted with K1 = all-zero key and K2 = all-one key, produces the following ciphertext and recovered keys:

Ciphertext: 0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1

Match found — K1: all-1 bits, K2: all-0 bits.

Note the recovered keys are swapped relative to the original (K1 was all-0, K2 was all-1 in the test setup), yet the attack still reports "Keys recovered successfully." This is a direct consequence of the simplified S-box: because sbox_substitution() doesn't perform real non-linear substitution, the round function loses enough diffusion that multiple distinct key pairs can produce the exact same ciphertext for this plaintext — a collision. The meet-in-the-middle search is working correctly; it just found a different valid key pair that happens to produce an identical ciphertext, which is itself a useful illustration of why the real DES S-boxes are essential for the algorithm's security, not just an implementation detail.`,
        screenshots: [import.meta.env.BASE_URL + 'images/des-1.png'],
      },
      {
        heading: '5. ElGamal — Domain Parameter Generation',
        body: `Moving from a symmetric block cipher to an asymmetric scheme, this section implements ElGamal, a public-key encryption algorithm based on the discrete logarithm problem. Its security depends on operating inside a group where computing discrete logarithms is hard, so the first step is generating a suitable prime-order subgroup rather than just picking a random large prime.

gen_prim() generates a random odd number of the requested bit length and tests it for primality with sympy's isprime(), retrying until a prime is found. gen_params() then builds a safe-prime-style setup: it picks a 160-bit prime q, and sets p = 2q + 1, retrying until p is also prime. This construction (p = 2q + 1, with q prime) makes p a safe prime, and the multiplicative group mod p has a subgroup of prime order q — this is the Schnorr-style subgroup construction, chosen because it avoids small-subgroup attacks that can leak bits of the private key in naive ElGamal implementations.

To find a generator alpha of that order-q subgroup, the code computes t = (p-1)/q and repeatedly raises a random element g to the power t mod p, discarding the result if it comes out to 1 (which would mean g produced a trivial subgroup). The output log confirms the resulting parameters: a 161-bit p and 160-bit q satisfying p = 2q + 1, exactly as designed.`,
        
      },
      {
        heading: '6. ElGamal — Key Generation, Encryption & Decryption',
        body: `keygen() picks the private key a as a random integer in [1, q), then computes the public key beta = alpha^a mod p. This is the standard discrete-log key pair: beta is public, a stays secret, and recovering a from alpha and beta is assumed computationally infeasible in this subgroup.

encrypt() implements the core ElGamal operation. For each encryption, a fresh random ephemeral value r is chosen in [1, q) — this randomness is essential; reusing r across two messages would let an attacker recover both plaintexts via a simple ratio. The ciphertext is the pair (gamma, delta), where gamma = alpha^r mod p acts as a one-time public key for this message, and delta = msg * beta^r mod p masks the message by multiplying it with a shared secret (beta^r) that only someone who knows a can reconstruct.

decrypt() reverses this: it recomputes the shared secret as gamma^a mod p (note alpha^(ra) = beta^r, since beta = alpha^a — this is the Diffie-Hellman-style shared secret both sides can derive independently), inverts it modulo p using inv_mod(), and multiplies by delta to recover the original message. inv_mod() computes the modular inverse via Fermat's Little Theorem (a^(p-2) mod p), which works because p is prime.`,
        
      },
      {
        heading: '7. ElGamal Results',
        body: `Running the script generates fresh domain parameters and a fresh key pair on each execution, then encrypts and decrypts a fixed test message (7897) to confirm correctness end-to-end:

p bits = 161, q bits = 160 (p = 2·q + 1)
Private key a = 75617819462856071551354035152335832999650810066
Public key: alpha = 26248474916464780500010124932205617...8079173394, beta = 24022580530511308081917609394405...3326682523538575

Original message: 7897
Encrypted message: (gamma, delta) = (14907707490910550884451161115181393...99436067, 16525802357163581529672584770409...1496396724)
Decrypted message: 7897

Verification: OK

The round trip confirms the implementation is correct — the message is recovered exactly after encryption and decryption using independently-generated random parameters. Unlike DES, a symmetric cipher where both parties share the same secret key, this demonstrates asymmetric encryption: a and the message are never transmitted, only the public values alpha, beta, and the ciphertext pair itself, yet the original holder of the private key a can still recover the plaintext.`,
        screenshots: ['/images/elgamal-1.png'],
      },
      {
        heading: '8. Lenstra ECM — Factoring with Elliptic Curves',
        body: `This section moves from encryption schemes to attacking one. Lenstra's Elliptic Curve Method (ECM) factors a composite number n by doing elliptic curve arithmetic modulo n. Since n = p * q, every operation is performed simultaneously modulo p and modulo q, and the group structure of the curve is generally different modulo each prime. That difference is what exposes a factor.

Two helpers support the arithmetic: gcd() is the classic Euclidean algorithm, and mod_inverse() computes modular inverses with the extended Euclidean algorithm. When the number being inverted shares a factor with the modulus, the inverse does not exist and mod_inverse() ends in a ZeroDivisionError, which the main routine treats as a signal to try another curve.

lenstra_ecm_factorization() works as follows:

- It picks random x, y and a modulo n, then computes b = y^2 - x^3 - a*x mod n. Solving for b guarantees that the point (x, y) lies on the curve y^2 = x^3 + a*x + b, so no point-finding step is needed.
- It checks gcd(4a^3 + 27b^2, n) == 1, which ensures the curve is non-singular. Otherwise it discards the curve and starts over.
- It repeatedly doubles the point using the standard tangent-line formulas (slope lam = (3x^2 + a) / 2y, then x_r and y_r).
- After each doubling it computes gcd(2y, n). If the result is strictly between 1 and n, then 2y is divisible by one prime but not the other: modulo that prime the point has reached order 2, and the next doubling would land on the point at infinity. The gcd is therefore a non-trivial factor of n.

This is a simplified version of ECM: it only doubles the point (multiplying it by powers of two) instead of multiplying by all integers up to a smoothness bound, so it succeeds only when the point's order modulo one of the primes happens to be a power of two. Retrying with up to 100 random curves makes that likely for a small modulus like the one used here, and the function returns None if every attempt fails.`,
        screenshots: [],
      },
      {
        heading: '9. RSA Decryption with the Chinese Remainder Theorem',
        body: `Once n is factored, the RSA private key is effectively compromised, so the second half of the script uses the recovered primes to decrypt. rsa_decrypt_with_crt() implements the standard CRT optimization of RSA decryption.

Instead of computing ciphertext^d mod n directly, it reduces the private exponent for each prime separately, d_p = d mod (p-1) and d_q = d mod (q-1), which is valid by Fermat's Little Theorem. It then performs two much smaller modular exponentiations, m1 = c^d_p mod p and m2 = c^d_q mod q. Finally it recombines the two partial results into a single value modulo n using the CRT formula (m1 * q * q^-1 mod p + m2 * p * p^-1 mod q) mod n, where each term is zero modulo the other prime, so the sum reproduces m1 modulo p and m2 modulo q.

Working with half-size numbers makes CRT decryption roughly four times faster than the direct computation, which is why it is used in practice. In this demo it also completes the attack chain: factor n with ECM, then use p and q to decrypt.`,
        screenshots: [],
      },
      {
        heading: '10. Lenstra ECM Results',
        body: `The script factors n = 10403 and then decrypts a sample ciphertext (1234) with the example private exponent d = 2753:

Factors found: p=103, q=101
Decrypted message: 10042

The ECM routine correctly recovers both prime factors of 10403 = 101 * 103. The modulus is deliberately tiny so the attack finishes instantly; real RSA moduli are thousands of bits long, and ECM is practical only against numbers with small prime factors, which illustrates why RSA key generation must use large primes of similar size. The ciphertext and exponent in the example are illustrative values rather than the output of a prior encryption step, so this run demonstrates the factoring-then-CRT-decryption pipeline end to end, not a full encrypt/decrypt round trip.`,
        screenshots: ['/images/lenstra-1.png'],
      },
      {
        heading: '11. Shamir Secret Sharing — Field Setup & Polynomial Sharing',
        body: `Shamir's Secret Sharing splits a secret into n shares so that any k of them can reconstruct it, while any k-1 shares reveal nothing about it. This implementation uses a (k, n) = (4, 10) threshold: ten people each receive one share, and any four of them can recover the secret together.

All arithmetic is done in the finite field Z_q, where q is a 160-bit prime. gen_prim() produces a random prime of the requested size by setting the top bit (so the number has exactly 160 bits) and the lowest bit (so it is odd), then testing it with sympy's isprime(). gen_q_and_p() searches for q such that p = 2q + 1 is also prime. Only q is used for the sharing itself; p is a leftover from the same safe-prime setup used in the ElGamal section and does not take part in this script. inv_mod() computes modular inverses with Fermat's Little Theorem (a^(q-2) mod q), which is valid because q is prime.

The secret is a random element of Z_q. gen_pol() builds a random polynomial of degree k-1 = 3 whose constant term is the secret and whose other coefficients are random values in Z_q, so f(0) = secret. eval_pol() evaluates it with Horner's method, and each person i receives the share f(i) for i = 1..10. Because a degree-3 polynomial is uniquely determined by four points, four shares are enough to pin it down, while three points are consistent with every possible value of the secret.`,
        screenshots: [],
      },
      {
        heading: '12. Reconstruction with Lagrange Interpolation',
        body: `To recover the secret, the shares of a qualifying subset A (here the first k = 4 participants) are interpolated at x = 0, since f(0) is the secret.

comp_c_A() computes the Lagrange coefficient for participant i: the product over all other j in A of (-j) / (i - j), taken modulo q. The numerator accumulates (-j mod q) and the denominator accumulates (i - j), and the division is performed by multiplying with the modular inverse of the denominator. These coefficients depend only on the participants' indices, not on the share values.

reconstruct_at_zero() then returns the sum over i in A of share_i * c_i mod q, which equals f(0) and therefore the original secret. Any four of the ten shares would work, because the interpolation formula is valid for any set of k distinct points.

Two practical notes: the script uses Python's random module, which is fine for a demonstration but not cryptographically secure (a real system would use the secrets module), and it shows the sharing scheme only, with no verification that the shares handed out are consistent.`,
        screenshots: [],
      },
      {
        heading: '13. Shamir Secret Sharing Results',
        body: `The script generates a random secret, produces ten shares, prints the first four, and reconstructs the secret from those four:

Initial secret: 523692306375940852364163805083336458086637182810

First 4 shares generated:
Person 1: 777866314421535241604723129421799893140359337790
Person 2: 656591333613611776783815937248471822528766740708
Person 3: 1208912758436143743367556389337157018224379637015
Person 4: 856534527140820973277374352493764542921255239404

Reconstruction from 4 shares: 523692306375940852364163805083336458086637182810
Secret correct!

The reconstructed value matches the original secret exactly, confirming that the polynomial generation, share evaluation and Lagrange interpolation are consistent. Each run uses fresh random parameters, so the numbers differ every time, but the final check always passes when at least k = 4 shares are combined.`,
        screenshots: ['/images/shamir-1.png'],
      },
    ],
    links: {
      github: '',
      demo: '',
    },
  },
    {
    id: 'deloitte-job-simulation',
    title: 'Deloitte Job Simulation: Security Log Analysis',
    featured: false,
    thumbnail: import.meta.env.BASE_URL + 'images/deloitte-2.png',

    shortDescription:
      'Analyzed web server access logs to identify suspicious automated activity, investigate authentication patterns, and assess network exposure in a simulated enterprise environment.',

    tags: [
      'Cybersecurity',
      'Log Analysis',
      'Threat Detection',
      'Network Security',
      'HTTP',
      'Incident Investigation'
    ],

    sections: [
      {
        heading: '1. Exercise Overview',

        body: `This exercise was part of the Deloitte Job Simulation and focused on analyzing web server access logs from Daikibo, a fictional manufacturing company.

The provided logs (web_requests.log / web_activity.log) recorded HTTP requests to an internal status dashboard across multiple user sessions, IP addresses, and factory locations: Meiyo, Berlin, Seiko, and Shenzhen.

The objective was to distinguish normal human browsing behavior from potentially suspicious or automated activity by examining authentication flows, HTTP response codes, request sequences, and access patterns.

Rather than relying on a single indicator, the investigation focused on behavioral anomalies and correlations between multiple characteristics of the recorded traffic.`,

      },

      {
        heading: '2. Network Exposure & Authentication',

        body: `The first question examined whether an external attacker could directly access the dashboard from the internet.

The observed sessions consistently followed an authentication flow:

- GET / returned HTTP 401 (Unauthorized).
- GET requests loaded the login page and its associated resources.
- POST /login submitted the authentication request.
- After successful authentication, GET / returned HTTP 200 and subsequent authorized API requests included an authorizedUserId.

According to the exercise scenario, the dashboard was hosted on Daikibo's internal network and could only be accessed through a VPN tunnel. Therefore, it was not directly exposed to the public internet.

This highlights the importance of network segmentation as a defense-in-depth measure. Restricting access to an internal service reduces its public attack surface, complementing application-level authentication and authorization controls.`,

        
      },

      {
        heading: '3. Log Analysis & Suspicious Activity Detection',

        body: `The main investigation involved identifying a user whose request patterns differed significantly from normal interactive browsing.

Normal sessions generally included the login flow, dashboard resources such as index.css and index.js, and occasional API requests made while navigating the application. These requests were typically irregularly spaced, consistent with a person interacting with the dashboard.

The suspicious session belonged to the user ID mdB7yD2dp1BFZPontHBQ1Z.

After an initially normal login sequence, this user repeatedly requested GET /api/factory/machine/status for all four factories: Meiyo, Seiko, Shenzhen, and Berlin. The requests occurred every hour, on the hour, over an extended period.

Several behavioral indicators made this activity stand out:

- Repetitive timing: requests followed a highly regular hourly schedule rather than an irregular pattern of human interaction.
- Missing page resources: the repeated API calls were not accompanied by the usual dashboard resources, such as index.css and index.js.
- Broad data collection: all four factories were queried during each polling cycle.
- Repeated activity after authentication failures: the same hourly pattern resumed after a period of HTTP 401 responses.

Taken together, these indicators were consistent with automated polling rather than ordinary interactive browsing.

Possible explanations include an unauthorized monitoring script, a non-interactive client using an existing account, or a compromised session. However, access logs alone do not establish which explanation is correct, so these remain hypotheses rather than confirmed findings.

The investigation demonstrates how HTTP status codes, request sequences, timestamps, resource requests, and user activity can be correlated to identify anomalous behavior in application logs.`,

      
      },

      {
        heading: '4. Key Takeaways',

        body: `This exercise reinforced several practical cybersecurity concepts:

- Log analysis: extracting meaningful behavioral patterns from raw HTTP access logs.
- Anomaly detection: identifying deviations from normal application usage through timing, request frequency, and endpoint access.
- Authentication analysis: interpreting HTTP 401 and 200 responses in the context of a user's session.
- Network security: understanding how VPN-restricted access and network segmentation reduce exposure.
- Investigative reasoning: distinguishing observed evidence from hypotheses when assessing potentially suspicious activity.

The main takeaway is that suspicious behavior is often identified through a combination of individually inconclusive indicators. Consistent timing, repeated API access, missing browser resources, and recurring authentication failures become more meaningful when examined together.`,

        screenshots: [
  import.meta.env.BASE_URL + 'images/deloitte-2.png' ],
      },
    ],

    links: {
      github: '',
      demo: '',
    },
  },
  {
  id: 'authenticated-encryption-go',
  title: 'Authenticated Encryption in Go: Composition Schemes + Reed-Solomon',
  featured: true,
  thumbnail: import.meta.env.BASE_URL + 'images/crypto-1.png',
  shortDescription:
    'A Go project comparing Encrypt-and-MAC, Encrypt-then-MAC and MAC-then-Encrypt, each with a Reed-Solomon error-correcting variant, plus AEAD, key exchange and McEliece modules.',
  tags: ['Go', 'Cryptography', 'AES-GCM', 'Reed-Solomon', 'ECDH'],
  sections: [
    {
      heading: '1. Project Overview',
      body: `This project, written in Go, studies authenticated encryption: how confidentiality and integrity can be combined, and how error-correcting codes can be added on top. It implements and compares the three classic composition methods (Encrypt-and-MAC, Encrypt-then-MAC, MAC-then-Encrypt), each in a standard version and in a version that uses Reed-Solomon error correction. A separate small project (ProiectMAC) demonstrates MAC usage with a 32-byte (AES-256-sized) key.`,
      screenshots: [import.meta.env.BASE_URL + 'images/crypto-1.png'],
    },
    {
      heading: '2. Project Structure',
      body: `- Authenticated encryption: implementations of the three composition techniques, plus a module that studies attacks on the MAC-then-Encrypt construction.
- Authenticated encryption with associated data: AES-GCM and AES-EAX implementations.
- Key exchange: ECDH and ECDHE-ECDSA implementations.
- Coding theory: Reed-Solomon codes, the McEliece cryptosystem, and a statistics module used to measure time and memory.
- Entry point: a main program that runs all examples and prints the results and benchmarks.`,
     
    },
    {
      heading: '3. Schemes Compared',
      body: `- Encrypt-and-MAC (E&M): the plaintext is encrypted, and a MAC is computed on the plaintext. Both are sent side by side.
- Encrypt-then-MAC (ETM): the plaintext is encrypted first, then a MAC is computed over the ciphertext. The output is a ciphertext and a separate MAC.
- MAC-then-Encrypt (MTE): a MAC is computed on the plaintext, then the plaintext and MAC are encrypted together. The output is a single ciphertext.
- For each scheme, a Reed-Solomon variant adds redundancy bytes so that corrupted data can be detected and corrected before verification.`,
      
    },
    {
      heading: '4. Functional Results',
      body: `All three schemes encrypt and decrypt test messages correctly (for example "Acesta este un mesaj secret" and the test string 1234567890ABCDEF).

In the Reed-Solomon examples, the data integrity check returns true and the original message is recovered.

ETM produces a ciphertext and a MAC as two separate hex values, while MTE produces one ciphertext, matching the theoretical definition of each scheme.

Encrypting the same plaintext several times gives a different ciphertext each time, which indicates that a fresh random IV/nonce is used per encryption, as required for secure operation.

Reed-Solomon was also tested on its own. With light corruption the original data was recovered. With heavier corruption the decoder could not correct the data, which is expected, because Reed-Solomon can only correct up to a fixed number of symbol errors determined by its redundancy.`,
      
    },
    {
      heading: '5. Performance: Execution Time',
      body: `Standard approach: below the timer resolution for all three schemes (reported as 0s), so these operations are too fast to measure with a single run.

Reed-Solomon approach: about 3.6 ms for E&M, about 3 ms for ETM and about 3 ms for MTE.

Reed-Solomon therefore adds roughly 3 ms of overhead per operation, similar across the three schemes.`,
      
    },
    {
      heading: '6. Performance: Memory Usage',
      body: `- E&M: 4 KB (standard) and 4 KB (Reed-Solomon).
- ETM: 4 KB (standard) and 7 KB (Reed-Solomon).
- MTE: 3 KB (standard) and 4 KB (Reed-Solomon).

The Reed-Solomon variants use equal or more memory because of the redundancy data. The increase is largest for ETM (+3 KB). All values are small, from a single run each.`,
      
    },
    {
      heading: '7. Analysis',
      body: `The three schemes behave as theory predicts. ETM is generally considered the safest composition, because the MAC is verified before any decryption happens. MTE exposes the decryption step to unauthenticated data, which is why attacks on it are studied in the project.

Reed-Solomon provides error correction (robustness against transmission or storage errors) that the plain schemes lack, at a modest and fairly uniform cost in time and memory.

The time overhead is dominated by encoding and decoding of the error-correcting code, not by the choice of composition scheme.`,
    },
    {
      heading: '8. Limitations and Future Work',
      body: `Timing was measured from single runs, so the standard-approach timings are below the clock resolution. A more accurate benchmark would repeat each operation thousands of times and average the result (for example with Go's testing.Benchmark).

Memory figures come from single runs and can vary with the garbage collector.

Keys are hardcoded for demonstration. In a real system they should be generated randomly or derived from a key exchange (the project already includes ECDH/ECDHE for this purpose).

Possible extensions: test Reed-Solomon with different redundancy levels, compare against AES-GCM and AES-EAX (which provide authenticated encryption natively), and benchmark on larger inputs.`,
    },
  ],
  links: {
    github: '',
    demo: '',
  },
},
  {
    id: 'smart-contract-vulnerability-detection',
    title: 'Detecting Smart Contract Vulnerabilities on Ethereum: Replicating and Extending a Machine Learning Pipeline with Comparative Tool Analysis',
    featured: true,
    thumbnail: import.meta.env.BASE_URL + 'images/poza-1.png',

    shortDescription:
      'Replicated the ContractWard machine learning pipeline on the SmartBugs-Wild dataset and investigated how disagreements between Slither and Mythril affect smart contract vulnerability classification.',

    tags: [
      'Cybersecurity',
      'Machine Learning',
      'Smart Contracts',
      'Ethereum',
      'Slither',
      'Mythril',
      'Python',
      'XGBoost',
      'Random Forest',
      'SVM',
      'TF-IDF',
      'Static Analysis'
    ],

    sections: [
      {
        heading: '1. Research Overview',

        body: `Smart contracts are programs deployed on blockchain networks, where vulnerabilities can result in financial losses. Traditional vulnerability detection relies heavily on static analysis tools such as Slither and Mythril. Although these tools are valuable, they use different analysis techniques, can produce false positives, and may disagree when evaluating the same contract.

This project replicates and extends the ContractWard machine learning pipeline proposed by Wang et al. (2021), using a different dataset and comparing the impact of alternative automatic labeling strategies.

The investigation focuses on three questions:

- Can the original machine learning approach be reproduced on a different dataset?
- How frequently do Slither and Mythril disagree when labeling the same smart contracts?
- How does the choice of labeling tool affect the performance of downstream machine learning models?

The central hypothesis is that automatically generated training labels are not equally reliable across tools, and that differences in labeling can substantially affect classification performance.`,

        screenshots: [
  import.meta.env.BASE_URL + 'images/poza-1.png'
],
      },

      {
        heading: '2. Dataset & Vulnerability Labeling',

        body: `The experiment uses SmartBugs-Wild, a dataset containing approximately 47,000 real-world smart contracts. A sample of 500 contracts was selected for the experiment.

Two static analysis tools were used to generate vulnerability labels: Mythril and Slither.

Mythril uses symbolic execution to explore possible execution paths with symbolic inputs and determine whether particular vulnerability conditions can be triggered. Its analysis can be computationally expensive, and older Solidity contracts may produce timeouts.

Slither parses Solidity source code into an abstract syntax tree, converts it into its intermediate representation (SlithIR), and applies a collection of static analysis detectors to identify potentially vulnerable code patterns.

The tools have different strengths and limitations. Slither is faster and produced usable results for more contracts in this experiment, while Mythril's analysis was affected by timeouts.

The dataset decreased from 500 selected contracts to 404 contracts analyzed by both tools, with 389 contracts ultimately available for opcode-based feature extraction.

This difference in coverage is important when interpreting the results, because the evaluated datasets are not necessarily identical across all stages of the pipeline.`,

        screenshots: [
  import.meta.env.BASE_URL + 'images/poza-2.png'
],
      },

      {
        heading: '3. Opcode Feature Extraction',

        body: `The machine learning pipeline represents smart contracts through their Ethereum Virtual Machine (EVM) opcodes rather than relying exclusively on raw Solidity source code.

The feature extraction process consists of three stages:

1. Convert each smart contract into an opcode sequence.
2. Generate opcode bigrams, representing pairs of consecutive opcodes.
3. Apply TF-IDF vectorization to transform the bigrams into numerical feature vectors.

Opcode bigrams provide an interpretable representation of local instruction patterns. Examples of informative features include dup1_revert, push1_keccak256, and callvalue_iszero.

The resulting feature matrix contains 389 contracts and 3,385 unique bigram features. Each contract contains an average of approximately 6,492 bigrams before the final vocabulary-based representation.

This representation allows conventional machine learning classifiers to learn patterns associated with the vulnerability labels generated by the static analysis tools.`,

        screenshots: [
          import.meta.env.BASE_URL + 'images/poza-3.png'
        ],
      },

      {
        heading: '4. Model Training & Evaluation',

        body: `Three supervised machine learning models were trained and evaluated:

- Random Forest: an ensemble of 100 decision trees.
- XGBoost: a gradient-boosted decision tree model.
- Support Vector Machine (SVM): a classifier that learns a decision boundary in the feature space.

The dataset was divided into 311 training samples and 78 test samples. SMOTE was applied to balance the training classes, increasing the vulnerable and safe classes to 166 samples each.

The models were evaluated using F1-score, allowing their classification performance to be compared with the results reported in the original ContractWard paper.

Using Slither-generated labels, XGBoost achieved an F1-score of 95.24%, compared with 96.41% reported in the original paper. Random Forest achieved 90.00%, while SVM achieved 73.39%.

These results suggest that the ContractWard approach can achieve comparable performance on a smaller, different dataset, although the substantial variation between models highlights the importance of experimental conditions and evaluation methodology.`,

        screenshots: [
  import.meta.env.BASE_URL + 'images/poza-4.png'
],
      },

      {
        heading: '5. Comparative Tool Analysis & Results',

        body: `A central contribution of this project is the comparison between vulnerability labels produced by Slither and Mythril.

Among the 404 contracts analyzed by both tools, the tools agreed on 209 contracts (51.7%) and disagreed on 195 (48.3%).

The agreement breakdown was:

- Both tools classified 38 contracts as vulnerable.
- Both tools classified 171 contracts as safe.
- Slither identified potential vulnerabilities missed by Mythril in 179 contracts.
- Mythril identified potential vulnerabilities missed by Slither in 16 contracts.

The experiment then examined how the labeling strategy affected machine learning performance.

When Mythril labels were used instead of Slither labels, the F1-scores changed as follows:

- Random Forest: 90.00% to 78.26%, a decrease of 11.74 percentage points.
- XGBoost: 95.24% to 66.67%, a decrease of 28.57 percentage points.
- SVM: 73.39% to 40.00%, a decrease of 33.39 percentage points.

The average decrease across the three models was approximately 24.57 percentage points.

These results demonstrate that the choice of automatic labeling tool can substantially influence the apparent performance of a machine learning pipeline.

However, tool disagreement does not establish that one tool is always correct. Slither's higher classification performance may partly reflect differences in label consistency or learnability rather than superior ground-truth accuracy. Human-validated labels would be needed to evaluate that distinction reliably.`,

        screenshots: [
          import.meta.env.BASE_URL + 'images/poza-5.png'
        ],
      },

      {
        heading: '6. Conclusions & Future Work',

        body: `The experiment produced three main findings.

First, the ContractWard pipeline was reproducible on a different dataset: XGBoost achieved an F1-score of 95.24%, approaching the 96.41% reported in the original paper.

Second, automatic labeling remains a significant limitation. Slither and Mythril disagreed on 48.3% of the contracts analyzed by both tools, demonstrating that vulnerability labels can depend heavily on the selected analysis tool.

Third, the labeling strategy substantially affected downstream model performance. Across Random Forest, XGBoost, and SVM, the average F1-score decreased by approximately 24.57 percentage points when Mythril labels were used instead of Slither labels.

These findings suggest that training data quality and label generation deserve as much attention as model selection when developing machine learning approaches for smart contract security.

Potential future directions include:

- Evaluating a larger dataset with human-validated vulnerability labels.
- Investigating multi-tool consensus labeling strategies.
- Developing vulnerability-specific classifiers for issues such as reentrancy, integer overflow, and timestamp dependence.
- Exploring real-time vulnerability screening before smart contracts are deployed.

The study also has limitations. The final test set contains only 78 contracts, the dataset decreases in size during preprocessing, and the tools do not necessarily analyze identical subsets. Consequently, the reported metrics should be interpreted as experimental results rather than definitive estimates of real-world detection performance.`,

      },
    ],

    links: {
      github: '',
      demo: '',
    },
  },
]