import { fixCapitalization } from './capitalization';

test('Word splitting edge cases', () => {
  expect(fixCapitalization('bugInARug', 'lower_snake')).toEqual('bug_in_a_rug');
  expect(fixCapitalization('HTTPHandler', 'lower_snake')).toEqual('http_handler');
  expect(fixCapitalization('HttpHandler', 'lower_snake')).toEqual('http_handler');
  expect(fixCapitalization('userID', 'lower_snake')).toEqual('user_id');
  expect(fixCapitalization('userId', 'lower_snake')).toEqual('user_id');
  expect(fixCapitalization('URLAndURIParser', 'lower_snake')).toEqual('url_and_uri_parser');
  expect(fixCapitalization('isHttp2', 'lower_snake')).toEqual('is_http_2');
  expect(fixCapitalization('isHTTP2', 'lower_snake')).toEqual('is_http_2');
});

test('Test basic generation', () => {
  expect(fixCapitalization('isHttp2', 'lower_snake')).toEqual('is_http_2');
  expect(fixCapitalization('isHttp2', 'lowerCamel')).toEqual('isHttp2');
  expect(fixCapitalization('isHttp2', 'lower-kebab')).toEqual('is-http-2');
  expect(fixCapitalization('isHttp2', 'UPPER_SNAKE')).toEqual('IS_HTTP_2');
  expect(fixCapitalization('isHttp2', 'UpperCamel')).toEqual('IsHttp2');
  expect(fixCapitalization('isHttp2', 'UPPER-KEBAB')).toEqual('IS-HTTP-2');
});
