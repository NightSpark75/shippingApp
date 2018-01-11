import { Toast } from 'native-base'
import base64 from 'base-64'

export function jwtPayload(token) {
    const code = token.split('.')[1]
    let payload = base64.decode(code)
    return JSON.parse(payload)
}