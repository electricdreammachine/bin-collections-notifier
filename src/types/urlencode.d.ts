declare function Encode(rawString: string): string;

declare module 'urlencode' {
    export = Encode
}