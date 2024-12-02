const Board = require("../models/boardModel");
const BoardComment = require("../models/boardCommentModel");
const User = require("../models/userModel");
const { sendJSONResponse, changeNumberExpression } = require("../../utils/utils");
const { ResStatus } = require("../../utils/const");

module.exports = {
	getBoardList: (req, res) => {
		const limit = req.query.limit || 10;
		const offset = req.query.offset || 0;
		const boards = Board.findBoards(limit, offset);

		if (boards === null) {
			return sendJSONResponse(res, 503, ResStatus.ERROR, "예상치 못한 에러가 발생했습니다.");
		}

		const boardList = boards.map(board => {
			const commentCnt = BoardComment.countByBoardId(board.id);
			const writer = User.findById(board.writerId);

			return {
				boardId: board.id,
				title: board.title,
				content: board.content.replaceAll("\n", "<br/>"),
				createdAt: board.createdAt,
				viewCnt: changeNumberExpression(board.viewCnt),
				likeCnt: changeNumberExpression(board.likeCnt),
				commentCnt: changeNumberExpression(commentCnt),
				writerNickname: writer.nickname,
				writerProfileImg: writer.profileImg || null,
			};
		});

		return sendJSONResponse(res, 200, ResStatus.SUCCESS, `게시글 ${boards.length}개를 가져왔습니다.`, boardList);
	},

	getBoardDetail: (req, res) => {
		const boardId = parseInt(req.params.boardId) || null;
		const board = Board.findById(boardId);

		if (boardId === null || board === null) {
			return sendJSONResponse(res, 503, ResStatus.ERROR, "예상치 못한 에러가 발생했습니다.");
		}

		const writer = User.findById(board.writerId);
		const commentCnt = BoardComment.countByBoardId(board.id);

		const boardDetail = {
			boardId: board.id,
			title: board.title,
			content: board.content,
			createdAt: board.createdAt,
			boardImg: board.boardImg,
			writerId: writer.writerId,
			writerNickname: writer.nickname,
			writerProfileImg: writer.profileImg || null,
			viewCnt: changeNumberExpression(board.viewCnt),
			likeCnt: changeNumberExpression(board.likeCnt),
			commentCnt: changeNumberExpression(commentCnt),
		};

		return sendJSONResponse(res, 200, ResStatus.SUCCESS, "게시글 상세 정보를 성공적으로 가져왔습니다.", boardDetail);
	},

	countBoardView: (req, res) => {
		const boardId = parseInt(req.params.boardId) || null;
		const board = Board.findById(boardId);

		if (boardId === null || board === null) {
			return sendJSONResponse(res, 503, ResStatus.ERROR, "예상치 못한 에러가 발생했습니다.");
		}

		console.log(board);

		board.viewCnt += 1;
		Board.save(board);

		return sendJSONResponse(res, 200, ResStatus.SUCCESS, "조회수가 성공적으로 증가하였습니다.");
	},
};