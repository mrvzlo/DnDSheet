import LZUTF8 from "lzutf8/build/production/lzutf8";
import Character from "./character";

export default class Encoder {
   dict: string[];

   constructor() {
      this.dict = [];
      this.dict.push('"knowledge":');
      this.dict.push(',"id":');
      this.dict.push(',"type":');
      this.dict.push('"value":');
      this.dict.push(',"checks":');
      this.dict.push("},{");
      this.dict.push("health");
   }

   compress(src: any): string {
      let json = JSON.stringify(src);
      if (!json) return "";

      this.dict.forEach((value, index) => {
         json = json.replaceAll(value, String.fromCharCode(index + 1));
      });
      return json;
   }

   decompress(src: string): any {
      this.dict.forEach((value, index) => {
         src = src.replaceAll(String.fromCharCode(index + 1), value);
      });
      return JSON.parse(src);
   }

   encode64(src: any): string {
      const string = this.compress(src);
      const binary = LZUTF8.encodeUTF8(string);
      const encoded = LZUTF8.encodeBase64(binary);
      return encoded;
   }

   encode256(src: any): string {
      const string = this.compress(src);
      const binary = LZUTF8.encodeUTF8(string);
      const encoded = LZUTF8.encodeStorageBinaryString(binary);
      return encoded;
   }

   decode64(src: string) {
      const binary = LZUTF8.decodeBase64(src);
      const string: any = LZUTF8.decodeUTF8(binary);
      const data = this.decompress(string);
      return this.parse(data, new Character());
   }

   decode256(src: string) {
      const binary = LZUTF8.decodeStorageBinaryString(src);
      const string: any = LZUTF8.decodeUTF8(binary);
      const data = this.decompress(string);
      return this.parse(data, new Character());
   }

   parse(data: any, object: any): any {
      if (typeof data !== "object" || data === null) {
         return data;
      }

      Object.keys(object).forEach((key) => {
         object[key] = this.parse(data[key], object[key]);
      });
      return object;
   }
}
