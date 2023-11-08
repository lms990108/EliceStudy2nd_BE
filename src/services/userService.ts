import axios from "axios";
import {
  UserRequestDTO,
  UserResponseDTO,
  KakaoUserDataDTO,
} from "../dtos/userDto";
import UserRepository from "../repositories/userRepository";
import NotFoundError from "../common/error/NotFoundError";
import BadRequestError from "../common/error/BadRequestError";
import {
  generateToken,
  generateRefreshToken,
} from "../common/utils/tokenUtils";

class UserService {
  // 회원가입
  async register(createUserRequestDTO: {
    user_id: string;
    social_provider: string;
    nickname: string;
    profile_url: string;
    interested_area: string;
  }) {
    const { user_id, social_provider, nickname, profile_url, interested_area } =
      createUserRequestDTO;

    const userData = {
      user_id,
      social_provider,
      nickname,
      profile_url,
      interested_area,
      role: "user",
      state: "가입",
    };

    const user = await UserRepository.createUser(userData);

    return user;
  }

  // 닉네임 중복 확인
  async checkNickname(user_id: string, nickname: string) {
    const user = await UserRepository.getUserById(user_id); // 가입하려는 사용자
    const existingUser = await UserRepository.getUserByNickname(nickname); // 존재하는 사용자

    if (existingUser) {
      if (
        user &&
        user.state === "탈퇴" &&
        user.nickname === existingUser.nickname
      ) {
        return true; // 탈퇴한 사용자는 기존 닉네임 사용 가능
      }

      throw new BadRequestError("중복된 닉네임입니다.");
    }

    return true;
  }

  // 카카오 로그인
  async kakaoLogin(authorizationCode: string) {
    const accessToken = await this.getKakaoToken(
      authorizationCode,
      process.env.KAKAO_REST_API_KEY,
    );
    const kakaoUserData = await this.getKakaoUserData(accessToken);
    const user = await UserRepository.getUserById(kakaoUserData.id);

    if (user) {
      if (user.state === "탈퇴") {
        return {
          user: null,
          token: null,
          refreshToken: null,
          kakaoUserData: kakaoUserData,
        };
      }
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      return { user, token, refreshToken, kakaoUserData };
    } else {
      return {
        user: null,
        token: null,
        refreshToken: null,
        kakaoUserData: kakaoUserData,
      };
    }
  }

  // 카카오 로그인 (get token)
  async getKakaoToken(code: string, client_id: string): Promise<string> {
    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("client_id", client_id);
    data.append("code", code);

    const response = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      },
    );

    return response.data.access_token;
  }

  // 카카오 로그인 (get user info)
  async getKakaoUserData(accessToken: string): Promise<KakaoUserDataDTO> {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers,
    });

    const result = response.data;

    return {
      id: result.id,
      profileUrl: result.kakao_account.profile.profile_image_url,
      nickname: result.kakao_account.profile.nickname,
    };
  }

  // 네이버 로그인
  async naverLogin(authorizationCode: string, state: string) {
    const accessToken = await this.getNaverToken(
      authorizationCode,
      state,
      process.env.NAVER_CLIENT_ID,
      process.env.NAVER_CLIENT_SECRET,
    );
    const naverUserData = await this.getNaverUserData(accessToken);
    const user = await UserRepository.getUserById(naverUserData.id);

    if (user) {
      if (user.state === "탈퇴") {
        return {
          user: null,
          token: null,
          refreshToken: null,
          naverUserData: naverUserData,
        };
      }
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      return { user, token, refreshToken, naverUserData };
    } else {
      return {
        user: null,
        token: null,
        refreshToken: null,
        naverUserData: naverUserData,
      };
    }
  }

  // 네이버 로그인 (get token)
  async getNaverToken(
    code: string,
    state: string,
    client_id: string,
    client_secret: string,
  ): Promise<string> {
    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("client_id", client_id);
    data.append("client_secret", client_secret);
    data.append("code", code);
    data.append("state", state);

    const response = await axios.post(
      "https://nid.naver.com/oauth2.0/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      },
    );

    return response.data.access_token;
  }

  // 네이버 로그인 (get user info)
  async getNaverUserData(accessToken: string): Promise<KakaoUserDataDTO> {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get("https://openapi.naver.com/v1/nid/me", {
      headers,
    });

    const result = response.data;

    return {
      id: result.response.id,
      profileUrl: result.response.profile_image,
      nickname: result.response.nickname,
    };
  }

  // 구글 로그인
  async googleLogin(authorizationCode: string) {
    const accessToken = await this.getGoogleToken(
      authorizationCode,
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    const googleUserData = await this.getGoogleUserData(accessToken);
    const user = await UserRepository.getUserById(googleUserData.id);

    if (user) {
      if (user.state === "탈퇴") {
        return {
          user: null,
          token: null,
          refreshToken: null,
          googleUserData: googleUserData,
        };
      }
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      return { user, token, refreshToken, googleUserData };
    } else {
      return {
        user: null,
        token: null,
        refreshToken: null,
        googleUserData: googleUserData,
      };
    }
  }

  // 구글 로그인 (get token)
  async getGoogleToken(
    code: string,
    client_id: string,
    client_secret: string,
  ): Promise<string> {
    // auth code를 URL 디코딩
    const decodedCode = decodeURIComponent(code);

    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("client_id", client_id);
    data.append("client_secret", client_secret);
    data.append("code", decodedCode);
    data.append("redirect_uri", process.env.GOOGLE_REDIRECT_URL);

    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      },
    );

    return response.data.access_token;
  }

  // 구글 로그인 (get user info)
  async getGoogleUserData(accessToken: string): Promise<KakaoUserDataDTO> {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers,
      },
    );

    const result = response.data;

    return {
      id: result.id,
      profileUrl: result.picture,
      nickname: result.given_name,
    };
  }

  // 회원정보 조회
  async getUserById(userId: string): Promise<UserResponseDTO | null> {
    const user = await UserRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    return user;
  }

  // 회원정보 수정
  async updateUser(
    userId: string,
    updateUserRequestDTO: UserRequestDTO,
  ): Promise<UserResponseDTO | null> {
    const user = await UserRepository.updateUser(userId, updateUserRequestDTO);

    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    return user;
  }

  // 회원정보 삭제(탈퇴)
  async deleteUser(userId: string): Promise<UserResponseDTO | null> {
    const user = await UserRepository.deleteUser(userId);

    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    return user;
  }

  // 전체 회원 목록 조회 (pagination: default 20개)
  async getAllUsers(page: number): Promise<UserResponseDTO[]> {
    const limit = 20; // 한 페이지에 표시할 개수
    const skip = (page - 1) * limit;

    const users = await UserRepository.getUsers(skip, limit);

    if (!users) {
      throw new NotFoundError("전체 회원 목록을 조회할 수 없습니다.");
    }

    return users;
  }
}

export default new UserService();
