import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CommentEditor from "./CommentEditor";
import postComment from "../../services/postComment";

vi.mock("../../services/postComment", () => ({
  default: vi.fn(),
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    headers: { Authorization: "Token test-token" },
    isAuth: true,
    loggedUser: { image: null, username: "test-user" },
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useParams: () => ({ slug: "test-article" }),
  };
});

describe("CommentEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables submit while the comment is empty or whitespace-only", () => {
    render(<CommentEditor updateComments={vi.fn()} />);

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const submitButton = screen.getByRole("button", { name: /post comment/i });

    expect(submitButton).toBeDisabled();

    fireEvent.change(textarea, { target: { value: " \n\t " } });

    expect(submitButton).toBeDisabled();
  });

  it("enables submit for non-empty comments and hides the empty hint", () => {
    render(<CommentEditor updateComments={vi.fn()} />);

    const textarea = screen.getByPlaceholderText("Write a comment...");
    const submitButton = screen.getByRole("button", { name: /post comment/i });

    fireEvent.submit(textarea.closest("form"));

    expect(screen.getByText("请输入评论内容")).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(submitButton).toBeEnabled();
    expect(screen.queryByText("请输入评论内容")).not.toBeInTheDocument();
  });

  it("blocks empty form submissions even if submit is triggered directly", () => {
    render(<CommentEditor updateComments={vi.fn()} />);

    fireEvent.submit(screen.getByPlaceholderText("Write a comment...").closest("form"));

    expect(postComment).not.toHaveBeenCalled();
    expect(screen.getByText("请输入评论内容")).toBeInTheDocument();
  });

  it("keeps the existing submit flow for valid comments", async () => {
    const updateComments = vi.fn();
    postComment.mockResolvedValue({ body: "Hello" });

    render(<CommentEditor updateComments={updateComments} />);

    const textarea = screen.getByPlaceholderText("Write a comment...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.submit(textarea.closest("form"));

    expect(postComment).toHaveBeenCalledWith({
      body: "Hello",
      headers: { Authorization: "Token test-token" },
      slug: "test-article",
    });
    await waitFor(() => expect(updateComments).toHaveBeenCalled());
  });
});
