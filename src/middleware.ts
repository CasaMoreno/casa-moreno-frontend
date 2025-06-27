import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Pega o cabeçalho secreto que o CloudFront deve enviar
    const requestHeader = request.headers.get('x-origin-verify');

    // A "senha secreta" está explícita aqui, como solicitado.
    const secret = 'e8a3a8b0-8c29-4e5a-9a9c-0c3d9b1a0f2e';

    // Se o cabeçalho estiver ausente ou for diferente da nossa senha,
    // bloqueamos a requisição com um erro 403 (Proibido).
    if (requestHeader !== secret) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Authentication failed' }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        );
    }

    // Se a senha estiver correta, a requisição continua normalmente.
    return NextResponse.next();
}

// Configuração para o middleware rodar em todas as requisições de página
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}