import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authUserMiddlewares";
import PostService from "../services/postService";

class PostController {
  async createPost(req: AuthRequest, res: Response): Promise<void> {
    // 인증된 사용자의 정보가 있는지 확인합니다.
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }

    try {
      const post = await PostService.create(req.body, req.user._id);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePost(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }

    const postNumber = Number(req.params.postNumber);
    const post = await PostService.update(postNumber, req.body, req.user._id);
    res.status(200).json(post);
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const posts = await PostService.findAllWithCommentsCount(page, limit);
    res.status(200).json(posts);
  }

  async getPostByNumber(req: Request, res: Response): Promise<void> {
    const post = await PostService.findByPostNumber(
      Number(req.params.postNumber),
    );
    res.status(200).json(post);
  }

  async getPostsByUserId(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const { posts, totalCount } = await PostService.findPostsByUserId(
      req.params.userId,
      page,
      limit,
    );

    res.status(200).json({ posts, totalCount });
  }

  async deletePostByNumber(req: AuthRequest, res: Response): Promise<void> {
    // 인증된 사용자의 정보가 있는지 확인합니다.
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }
    const post = await PostService.deleteByPostNumber(
      Number(req.params.postNumber),
      req.user._id,
    );
    res.status(200).json(post);
  }

  // 게시글 제목으로 검색
  async searchPostsByTitle(req: Request, res: Response): Promise<void> {
    try {
      const title = req.query.title as string;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      // 검색어가 없는 경우, 빈 리스트 반환
      if (!title) {
        res.status(200).json([]);
        return;
      }

      // 검색어가 있는 경우, 검색 결과 반환
      const searchResults = await PostService.findByTitle(title, page, limit);
      res.status(200).json(searchResults);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 태그로 검색
  async searchPostsByTag(req: Request, res: Response): Promise<void> {
    try {
      const tag = req.query.tag as string;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      // 검색어가 없는 경우, 빈 리스트 반환
      if (!tag) {
        res.status(200).json([]);
        return;
      }

      // 검색어가 있는 경우, 검색 결과 반환
      const searchResults = await PostService.findByTag(tag, page, limit);
      res.status(200).json(searchResults);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 일괄 삭제
  async deleteMultiplePosts(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }
    const postNumbers = req.body.postNumbers; // 게시글 번호 배열
    const deletedPosts = await PostService.deleteMultipleByPostNumbers(
      postNumbers,
      req.user._id,
    );
    res.status(200).json(deletedPosts);
  }

  // 통합 검색
  async searchPosts(req: Request, res: Response): Promise<void> {
    try {
      const type = req.query.type as string; // 'title' 또는 'tag'
      const query = req.query.query as string; // 검색어
      const page = Number(req.query.page || 1); // 페이지 번호, 기본값은 1
      const limit = Number(req.query.limit || 10); // 페이지 당 항목 수, 기본값은 10

      // 검색 유형과 검색어가 모두 제공되었는지 확인
      if (!type || !query) {
        res.status(400).json({ message: "타입과 검색어를 입력하세요." });
        return;
      }

      // 서비스 로직을 호출하여 검색 수행
      const searchResults = await PostService.searchPosts(
        type,
        query,
        page,
        limit,
      );

      // 검색 결과 반환
      res.status(200).json(searchResults);
    } catch (error) {
      // 오류 처리
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 추천
  async likePost(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res
        .status(401)
        .json({ message: "로그인한 사용자만 추천할 수 있습니다." });
      return;
    }

    const postNumber = Number(req.params.postNumber);

    try {
      const updatedPost = await PostService.likePost(postNumber, req.user._id);
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new PostController();
