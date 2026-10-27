import { type FormEvent, type ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Route,
  Switch,
  Router as WouterRouter,
  Link,
  useLocation,
  useParams,
} from "wouter";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircle,
  Shield,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  useHealthCheck,
  getHealthCheckQueryKey,
  useListStories,
  getListStoriesQueryKey,
  useCreateStory,
  getGetStoriesOverviewQueryKey,
  useGetStoriesOverview,
  useGetStory,
  getGetStoryQueryKey,
  useSupportStory,
  useListStoryReplies,
  getListStoryRepliesQueryKey,
  useCreateStoryReply,
} from "@workspace/api-client-react";
import type { Story, StoryTopic } from "@workspace/api-client-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import "./index.css";
import "./App.css";

const queryClient = new QueryClient();
const topicNames: Record<string, string> = {
  confidence: "Confidence",
  relationships: "Relationships",
  work: "Work",
  wellbeing: "Wellbeing",
  safety: "Safety",
};
const topicFilters = [
  "all",
  "confidence",
  "relationships",
  "work",
  "wellbeing",
  "safety",
];
function Shell({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" data-testid="link-home">
            <span className="brand-mark">
              <HeartHandshake size={20} />
            </span>
            <span>
              shree<span className="brand-period">.</span>
            </span>
          </Link>
          <nav
            className={`nav-links ${open ? "nav-open" : ""}`}
            aria-label="Main navigation"
          >
            <Link
              onClick={() => setOpen(false)}
              className={loc === "/stories" ? "active" : ""}
              href="/stories"
            >
              Community stories
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className={loc === "/safety" ? "active" : ""}
              href="/safety"
            >
              Safety
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className={loc === "/help" ? "active" : ""}
              href="/help"
            >
              Find local help
            </Link>
          </nav>
          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            data-testid="button-menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/stories" className="header-cta">
            Share your story <ArrowRight size={15} />
          </Link>
        </div>
      </header>
      <main className="page-enter">{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <HeartHandshake size={18} />
            </span>
            <span>
              shree<span className="brand-period">.</span>
            </span>
          </Link>
          <span className="footer-note">A softer place to be heard.</span>
          <div className="footer-links">
            <Link href="/safety">Safety & privacy</Link>
            <Link href="/help">Local support</Link>
          </div>
          <span className="copyright">You are not alone in this.</span>
        </div>
      </footer>
    </div>
  );
}
function Home() {
  const { data: overview } = useGetStoriesOverview();
  const { data: health } = useHealthCheck({
    query: { queryKey: getHealthCheckQueryKey() },
  });
  const {
    data: stories,
    isLoading,
    error,
  } = useListStories(
    { topic: "all" },
    { query: { queryKey: getListStoriesQueryKey({ topic: "all" }) } },
  );
  const featured = stories?.slice(0, 3) ?? [];
  return (
    <Shell>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" />A space made for you
          </div>
          <h1 className="serif">
            Your voice belongs
            <br />
            here, <em>just as it is.</em>
          </h1>
          <p className="hero-intro">
            A quiet, caring community to share what’s on your mind, hear from
            women who understand, and take things at your own pace.
          </p>
          <div className="hero-actions">
            <Link href="/stories" className="button button-primary">
              Read community stories <ArrowRight size={17} />
            </Link>
            <Link href="/safety" className="button button-quiet">
              <ShieldCheck size={17} /> How we keep this space safe
            </Link>
          </div>
          <div className="hero-trust">
            <LockKeyhole size={14} />
            <span>No profiles. No names. Just people listening.</span>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Abstract illustration of a protected, welcoming space"
        >
          <div className="sun-disc" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-ribbon ribbon-a" />
          <div className="art-ribbon ribbon-b" />
          <div className="art-leaf">
            <span />
            <span />
            <span />
          </div>
          <div className="art-label">
            <span className="label-dot" />A place to exhale
          </div>
          <div className="art-note">
            You can take
            <br />
            your time.
          </div>
        </div>
        <div className="hero-bottom">
          <span className="hero-index">01 — 04</span>
          <span>
            Some things are easier when you don’t have to carry them alone.
          </span>
          <ArrowDown size={16} />
        </div>
      </section>
      <section className="quiet-band">
        <div className="wrap quiet-inner">
          <div>
            <span className="mini-label">
              A community, not a comment section
            </span>
            <h2 className="serif">
              You decide what to share.
              <br />
              <em>We meet you with care.</em>
            </h2>
          </div>
          <div className="quiet-right">
            <p>
              Every story is anonymous. Every reply is an invitation to listen,
              never a demand to explain.
            </p>
            <Link href="/safety" className="text-link">
              Read our community promise <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="wrap home-stories">
        <div className="section-heading">
          <div>
            <span className="mini-label">From the community</span>
            <h2 className="serif">
              A few words from <em>here.</em>
            </h2>
          </div>
          <Link href="/stories" className="text-link">
            See all stories <ArrowRight size={15} />
          </Link>
        </div>
        {isLoading ? (
          <StorySkeleton />
        ) : error ? (
          <ErrorBox
            retry={() =>
              queryClient.invalidateQueries({
                queryKey: getListStoriesQueryKey({ topic: "all" }),
              })
            }
          />
        ) : featured.length ? (
          <div className="story-grid">
            {featured.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </div>
        ) : (
          <EmptyStories />
        )}
        <div className="community-count">
          <span className="count-mark">
            <Heart size={16} />
          </span>
          <span>
            <strong>{overview?.storyCount ?? 0}</strong> stories shared <i />{" "}
            <strong>{overview?.replyCount ?? 0}</strong> moments of support
          </span>
          <span className="count-health">
            {health?.status === "ok"
              ? "Community space is here for you"
              : "A gentle place to begin"}
          </span>
        </div>
      </section>
      <section className="closing-cta">
        <div className="closing-inner">
          <span className="mini-label">Whenever you’re ready</span>
          <h2 className="serif">
            There’s room for <em>your story.</em>
          </h2>
          <p>
            You can read first. You can leave at any time. You can share only
            what feels right.
          </p>
          <Link href="/stories" className="button button-light">
            Enter the community <ArrowRight size={16} />
          </Link>
        </div>
        <div className="closing-shape" />
      </section>
    </Shell>
  );
}
function StoryCard({ story, index = 0 }: { story: Story; index?: number }) {
  return (
    <article
      className={`story-card card-tone-${index % 3}`}
      data-testid={`card-story-${story.id}`}
    >
      <div className="story-card-top">
        <span className="topic-pill">{topicNames[story.topic]}</span>
        <span className="anonymous-mark">
          <LockKeyhole size={12} /> Anonymous
        </span>
      </div>
      <Link href={`/stories/${story.id}`} className="story-card-title serif">
        {story.title}
      </Link>
      <p className="story-excerpt">
        {story.content.length > 178
          ? story.content.slice(0, 178).trim() + "…"
          : story.content}
      </p>
      <div className="story-card-bottom">
        <span>{formatDate(story.createdAt)}</span>
        <span className="story-metrics">
          <Heart size={14} />
          {story.supportCount}
          <MessageCircle size={14} />
          {story.replyCount}
        </span>
        <Link
          className="story-open"
          href={`/stories/${story.id}`}
          aria-label={`Read ${story.title}`}
        >
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
function formatDate(date: string) {
  const d = new Date(date);
  return Number.isNaN(d.getTime())
    ? "Recently"
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(d);
}
function StorySkeleton() {
  return (
    <div className="story-grid">
      {[0, 1, 2].map((i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-line short" />
          <div className="skeleton-line title" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ))}
    </div>
  );
}
function ErrorBox({ retry }: { retry: () => void }) {
  return (
    <div className="error-box">
      <AlertCircle size={19} />
      <div>
        <strong>We couldn’t load this just now.</strong>
        <p>Please try again in a moment.</p>
      </div>
      <button className="small-button" onClick={retry}>
        Try again
      </button>
    </div>
  );
}
function EmptyStories() {
  return (
    <div className="empty-stories">
      <span className="empty-icon">
        <Heart size={21} />
      </span>
      <h3 className="serif">A little quiet, before the first story.</h3>
      <p>
        When someone is ready to share, their words will be here. You can be the
        first.
      </p>
      <Link className="text-link" href="/stories">
        Share anonymously <ArrowRight size={15} />
      </Link>
    </div>
  );
}
function Stories() {
  const [topic, setTopic] = useState("all");
  const [compose, setCompose] = useState(false);
  const queryKey = getListStoriesQueryKey(
    topic === "all" ? { topic: "all" } : { topic: topic as StoryTopic },
  );
  const {
    data: stories,
    isLoading,
    error,
  } = useListStories(
    topic === "all" ? { topic: "all" } : { topic: topic as StoryTopic },
    { query: { queryKey } },
  );
  const { mutate, isPending } = useCreateStory({
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getListStoriesQueryKey({ topic: "all" }),
          }),
          queryClient.invalidateQueries({
            queryKey: getGetStoriesOverviewQueryKey(),
          }),
          queryClient.invalidateQueries({ queryKey }),
        ]);
        setCompose(false);
      },
    },
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<StoryTopic>("wellbeing");
  const [formError, setFormError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (title.trim().length < 4 || content.trim().length < 20) {
      setFormError(
        "Add a title of at least 4 characters and a story of at least 20.",
      );
      return;
    }
    mutate({
      data: { title: title.trim(), content: content.trim(), topic: category },
    });
  }
  return (
    <Shell>
      <section className="page-head wrap">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to welcome
        </Link>
        <div className="page-head-grid">
          <div>
            <span className="mini-label">A community that listens</span>
            <h1 className="serif">
              Stories shared <em>with care.</em>
            </h1>
            <p>
              Read in your own time. Offer support without needing to solve
              anything.
            </p>
          </div>
          <button
            onClick={() => setCompose(!compose)}
            className="button button-primary compose-trigger"
          >
            {compose ? <X size={16} /> : <Sparkles size={16} />}{" "}
            {compose ? "Close writing space" : "Share your story"}
          </button>
        </div>
      </section>
      <section className="wrap stories-area">
        {compose && (
          <form
            onSubmit={submit}
            className="compose-panel"
            data-testid="form-create-story"
          >
            <div className="compose-header">
              <div>
                <span className="mini-label">Your words, your choice</span>
                <h2 className="serif">
                  Write what feels <em>right.</em>
                </h2>
              </div>
              <div className="compose-lock">
                <LockKeyhole size={15} /> Shared anonymously
              </div>
            </div>
            <label className="field-label" htmlFor="story-title">
              A title for your story
            </label>
            <input
              id="story-title"
              data-testid="input-story-title"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A few words to begin"
              required
              minLength={4}
            />
            <label className="field-label" htmlFor="story-topic">
              Choose a topic
            </label>
            <select
              id="story-topic"
              data-testid="select-story-topic"
              value={category}
              onChange={(e) => setCategory(e.target.value as StoryTopic)}
            >
              {Object.entries(topicNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
            <label className="field-label" htmlFor="story-content">
              Your story
            </label>
            <textarea
              id="story-content"
              data-testid="input-story-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start anywhere. Share only what you want others to know."
              maxLength={4000}
              minLength={20}
              rows={7}
              required
            />
            <div className="privacy-reminder">
              <ShieldCheck size={17} />
              <span>
                Please leave out names, addresses, phone numbers, and any
                details that could identify you or someone else. Stories are
                public and anonymous.
              </span>
            </div>
            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}
            {isPending && (
              <p className="form-status">Your story is being shared…</p>
            )}
            <div className="compose-actions">
              <span>{content.length}/4000 characters</span>
              <button
                disabled={isPending}
                className="button button-primary"
                type="submit"
              >
                {isPending ? "Sharing…" : "Share anonymously"}{" "}
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        )}
        <div className="filter-row">
          <div className="filter-label">
            <span className="mini-label">Browse by topic</span>
            <span>Find what feels close to you.</span>
          </div>
          <div
            className="filter-pills"
            role="group"
            aria-label="Filter stories by topic"
          >
            {topicFilters.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`filter-pill ${topic === t ? "selected" : ""}`}
                data-testid={`filter-${t}`}
              >
                {t === "all" ? "All stories" : topicNames[t]}
              </button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <StorySkeleton />
        ) : error ? (
          <ErrorBox retry={() => queryClient.invalidateQueries({ queryKey })} />
        ) : stories?.length ? (
          <div className="story-grid">
            {stories.map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} />
            ))}
          </div>
        ) : (
          <EmptyStories />
        )}
        <div className="notice-strip">
          <LockKeyhole size={17} />
          <p>
            <strong>A gentle reminder:</strong> This is a public space. Keep
            identifying details out of every story and reply.
          </p>
          <Link href="/safety">
            Our safety guide <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </Shell>
  );
}
function StoryDetail() {
  const { id = "" } = useParams();
  const {
    data: story,
    isLoading,
    error,
  } = useGetStory(id, {
    query: { queryKey: getGetStoryQueryKey(id), enabled: !!id },
  });
  const { data: replies, isLoading: replyLoading } = useListStoryReplies(id, {
    query: { queryKey: getListStoryRepliesQueryKey(id), enabled: !!id },
  });
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const { mutate: support, isPending: supportPending } = useSupportStory({
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: getGetStoryQueryKey(id) }),
          queryClient.invalidateQueries({
            queryKey: getListStoriesQueryKey({ topic: "all" }),
          }),
          queryClient.invalidateQueries({
            queryKey: getGetStoriesOverviewQueryKey(),
          }),
        ]);
        setStatus("Your support has been added.");
      },
    },
  });
  const { mutate: addReply, isPending: replyPending } = useCreateStoryReply({
    mutation: {
      onSuccess: async () => {
        setReply("");
        setStatus("Your supportive reply has been shared anonymously.");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getListStoryRepliesQueryKey(id),
          }),
          queryClient.invalidateQueries({ queryKey: getGetStoryQueryKey(id) }),
          queryClient.invalidateQueries({
            queryKey: getListStoriesQueryKey({ topic: "all" }),
          }),
          queryClient.invalidateQueries({
            queryKey: getGetStoriesOverviewQueryKey(),
          }),
        ]);
      },
    },
  });
  return (
    <Shell>
      <section className="wrap detail-page">
        <Link href="/stories" className="back-link">
          <ArrowLeft size={15} /> All stories
        </Link>
        {isLoading ? (
          <div className="detail-skeleton">
            <div className="skeleton-line short" />
            <div className="skeleton-line title" />
            <div className="skeleton-line" />
          </div>
        ) : error || !story ? (
          <ErrorBox
            retry={() =>
              queryClient.invalidateQueries({
                queryKey: getGetStoryQueryKey(id),
              })
            }
          />
        ) : (
          <>
            <div className="detail-layout">
              <article className="detail-main">
                <div className="story-card-top">
                  <span className="topic-pill">{topicNames[story.topic]}</span>
                  <span className="anonymous-mark">
                    <LockKeyhole size={12} /> Shared anonymously
                  </span>
                </div>
                <h1 className="serif detail-title">{story.title}</h1>
                <div className="detail-date">
                  Shared {formatDate(story.createdAt)}
                </div>
                <div className="detail-content">{story.content}</div>
                <div className="support-panel">
                  <div className="support-symbol">
                    <Heart size={20} />
                  </div>
                  <div>
                    <strong>Let them know they’re heard.</strong>
                    <p>A small gesture can mean a lot. No words needed.</p>
                  </div>
                  <button
                    disabled={supportPending}
                    className="button button-support"
                    onClick={() => support({ id })}
                    data-testid="button-support-story"
                  >
                    <Heart size={15} />
                    {supportPending ? "Sending…" : "Send support"}{" "}
                    <span>{story.supportCount}</span>
                  </button>
                </div>
                {status && (
                  <p className="form-status" role="status">
                    {status}
                  </p>
                )}
                <div className="reply-section">
                  <div className="section-heading reply-heading">
                    <div>
                      <span className="mini-label">A little understanding</span>
                      <h2 className="serif">
                        Words from <em>others.</em>
                      </h2>
                    </div>
                    <span className="reply-count">
                      <MessageCircle size={15} />
                      {story.replyCount}
                    </span>
                  </div>
                  {replyLoading ? (
                    <div className="skeleton-line" />
                  ) : replies?.length ? (
                    <div className="reply-list">
                      {replies.map((item) => (
                        <article
                          className="reply-card"
                          key={item.id}
                          data-testid={`card-reply-${item.id}`}
                        >
                          <div className="reply-meta">
                            <span className="reply-avatar">
                              <Heart size={13} />
                            </span>
                            <span>Someone in the community</span>
                            <time>{formatDate(item.createdAt)}</time>
                          </div>
                          <p>{item.content}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="reply-empty">
                      No replies yet. A kind word can start here.
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (reply.trim().length >= 2)
                        addReply({ id, data: { content: reply.trim() } });
                    }}
                    className="reply-form"
                  >
                    <label htmlFor="reply-content" className="field-label">
                      Offer a few words of support
                    </label>
                    <textarea
                      id="reply-content"
                      data-testid="input-story-reply"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={4}
                      maxLength={1500}
                      minLength={2}
                      placeholder="Listen, encourage, or simply say you hear them."
                      required
                    />
                    <div className="privacy-reminder">
                      <LockKeyhole size={15} />
                      <span>
                        Replies are public and anonymous. Don’t include names or
                        identifying details.
                      </span>
                    </div>
                    <div className="reply-submit">
                      <span>{reply.length}/1500</span>
                      <button
                        className="button button-primary"
                        disabled={replyPending}
                        type="submit"
                      >
                        {replyPending ? "Sharing…" : "Share reply anonymously"}{" "}
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </form>
                </div>
              </article>
              <aside className="detail-aside">
                <div className="aside-card">
                  <ShieldCheck size={22} />
                  <h3 className="serif">A softer kind of social space.</h3>
                  <p>
                    No profiles or private messages. Just anonymous stories and
                    thoughtful replies, shared in public.
                  </p>
                  <Link href="/safety" className="text-link">
                    How we keep it safe <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="aside-note">
                  <span>KEEP IN MIND</span>
                  <p>You never need to share more than feels comfortable.</p>
                </div>
              </aside>
            </div>
          </>
        )}
      </section>
    </Shell>
  );
}
function Safety() {
  return (
    <Shell>
      <section className="wrap info-page">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to welcome
        </Link>
        <div className="info-hero">
          <span className="info-icon">
            <ShieldCheck size={25} />
          </span>
          <span className="mini-label">Our community promise</span>
          <h1 className="serif">
            Your safety comes <em>before your story.</em>
          </h1>
          <p>
            You are in control here. Sharing is always your choice, and you can
            take a moment before deciding what feels safe.
          </p>
        </div>
        <div className="safety-grid">
          <article className="safety-card safety-feature">
            <span className="safety-number">01</span>
            <LockKeyhole size={20} />
            <h2 className="serif">Anonymous by design.</h2>
            <p>
              Stories and replies are shared without a public profile. Still,
              the details you include are yours to protect: leave out names,
              addresses, phone numbers, workplaces, and anything else that could
              identify you or another person.
            </p>
          </article>
          <article className="safety-card">
            <span className="safety-number">02</span>
            <HeartHandshake size={20} />
            <h2 className="serif">Care, not judgment.</h2>
            <p>
              This community is here to listen and encourage, not to pressure
              you for details or tell you what to do. You can read quietly
              without sharing a word.
            </p>
          </article>
          <article className="safety-card">
            <span className="safety-number">03</span>
            <Shield size={20} />
            <h2 className="serif">A public space.</h2>
            <p>
              Stories and replies can be read by other visitors. Please only
              post what you are comfortable making public. Avoid sharing someone
              else’s private or identifying information.
            </p>
          </article>
          <article className="safety-card safety-warm">
            <span className="safety-number">04</span>
            <Sparkles size={20} />
            <h2 className="serif">Go at your own pace.</h2>
            <p>
              You can pause, close this page, or simply take in what others have
              shared. There is no right way or timeline for speaking up.
            </p>
          </article>
        </div>
        <div className="safety-footer-callout">
          <div>
            <span className="mini-label">Need something more practical?</span>
            <h2 className="serif">
              Find support, <em>your way.</em>
            </h2>
            <p>
              Explore location-sharing and ideas for finding local help, without
              sending us your location.
            </p>
          </div>
          <Link href="/help" className="button button-primary">
            Explore local help <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </Shell>
  );
}
function Help() {
  const [consented, setConsented] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function shareLocation() {
    if (!navigator.geolocation) {
      setMessage(
        "Location sharing is not available in this browser. You can open a maps app and search for a nearby support service instead.",
      );
      return;
    }
    setLoading(true);
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        setLoading(false);
        if (navigator.share) {
          try {
            await navigator.share({
              title: "A place to find local support",
              text: "A maps link to this location",
              url: mapUrl,
            });
            setMessage(
              "The maps link was shared using your device. Shree did not send or save your location.",
            );
          } catch (err) {
            if (err instanceof Error && err.name === "AbortError")
              setMessage("Sharing was cancelled. Your location was not saved.");
            else setMessage(`Your maps link is ready: ${mapUrl}`);
          }
        } else {
          try {
            await navigator.clipboard.writeText(mapUrl);
            setMessage(
              "Maps link copied. Share it with someone you trust. Shree did not send or save your location.",
            );
          } catch {
            setMessage(`Copy this maps link to share it: ${mapUrl}`);
          }
        }
      },
      () => {
        setLoading(false);
        setMessage(
          "We could not access your location. Check your browser permission, or open a maps app and search for a nearby support service.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
    );
  }
  return (
    <Shell>
      <section className="wrap info-page help-page">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to welcome
        </Link>
        <div className="info-hero help-hero">
          <span className="info-icon">
            <MapPin size={24} />
          </span>
          <span className="mini-label">Practical support, on your terms</span>
          <h1 className="serif">
            A next step, <em>if you want one.</em>
          </h1>
          <p>
            Finding local support can feel like a lot. Here are a few ways to
            explore, without sharing your location with us.
          </p>
        </div>
        <div className="help-layout">
          <article className="location-card">
            <span className="location-kicker">
              <MapPin size={15} /> OPTIONAL · ONLY WHEN YOU CHOOSE
            </span>
            <h2 className="serif">
              Share a place, <em>not your story.</em>
            </h2>
            <p>
              With your permission, your browser can make a maps link for your
              current location. You decide whether to share it using your
              device’s sharing options, or copy it yourself.
            </p>
            <div className="location-assurances">
              <div>
                <Check size={15} /> Only after you tap and allow it
              </div>
              <div>
                <Check size={15} /> Never saved by Shree
              </div>
              <div>
                <Check size={15} /> No ongoing location access
              </div>
              <div>
                <Check size={15} /> Nothing sent to a helpdesk
              </div>
            </div>
            {!consented ? (
              <button
                onClick={() => {
                  setConsented(true);
                  setMessage(
                    "Your location will only be requested after you press the button below.",
                  );
                }}
                className="button button-primary"
                data-testid="button-location-consent"
              >
                I understand — show the option <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={shareLocation}
                disabled={loading}
                className="button button-primary"
                data-testid="button-share-location"
              >
                <MapPin size={16} />
                {loading ? "Waiting for your browser…" : "Create a maps link"}
              </button>
            )}
            {message && (
              <p className="location-message" role="status">
                {message}
              </p>
            )}
            <p className="location-disclaimer">
              Your browser will ask for location permission. If you say no,
              nothing is shared.
            </p>
          </article>
          <aside className="local-guidance">
            <div className="guide-icon">
              <ShieldCheck size={21} />
            </div>
            <span className="mini-label">Finding help nearby</span>
            <h2 className="serif">
              Start with what feels <em>safe.</em>
            </h2>
            <ul>
              <li>
                Search for a local women’s support organization or community
                service.
              </li>
              <li>
                Ask someone you trust to help you find options, if that feels
                right.
              </li>
              <li>
                Consider whether your device or browser is private before
                searching.
              </li>
            </ul>
          </aside>
        </div>
        <section className="helpline-section" aria-labelledby="helpline-title">
          <div className="helpline-heading">
            <span className="mini-label">India · trusted support lines</span>
            <h2 id="helpline-title" className="serif">
              Help is <em>within reach.</em>
            </h2>
            <p>
              If you are in immediate danger and it is safe to call, contact
              emergency services directly.
            </p>
          </div>
          <div className="helpline-grid">
            <a className="helpline-card helpline-card-emergency" href="tel:112">
              <span className="helpline-type">National emergency response</span>
              <strong className="helpline-number">112</strong>
              <span className="helpline-detail">
                Emergency support across India
              </span>
              <span className="helpline-source">Government source: NCW</span>
            </a>
            <a className="helpline-card" href="tel:181">
              <span className="helpline-type">Women Helpline</span>
              <strong className="helpline-number">181</strong>
              <span className="helpline-detail">
                24-hour women’s support and information
              </span>
              <span className="helpline-source">Government source: WCD</span>
            </a>
            <a className="helpline-card" href="tel:14490">
              <span className="helpline-type">
                National Commission for Women
              </span>
              <strong className="helpline-number">14490</strong>
              <span className="helpline-detail">NCW 24×7 Women Helpline</span>
              <span className="helpline-source">Government source: NCW</span>
            </a>
          </div>
          <section className="helpline-note">
            <span className="helpline-mark">
              <AlertCircle size={19} />
            </span>
            <div>
              <strong>Check local availability</strong>
              <p>
                The Ministry of Women and Child Development reports that 181 is
                operational in all States and Union Territories except West
                Bengal. If you are in West Bengal, call 112 for emergencies and
                consult local government support services for women. Verify
                details with the official sources:{" "}
                <a
                  href="https://www.wcd.gov.in/public/offerings/women--helpline--scheme"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ministry of Women and Child Development
                </a>{" "}
                and{" "}
                <a
                  href="https://www.ncw.gov.in/other-useful-helplines"
                  target="_blank"
                  rel="noreferrer"
                >
                  National Commission for Women
                </a>
                .
              </p>
            </div>
          </section>
        </section>
        <div className="help-end">
          <span>Whatever you choose next, it belongs to you.</span>
          <Link href="/safety" className="text-link">
            Read our safety guide <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </Shell>
  );
}
function Router() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/stories" component={Stories} />
        <Route path="/stories/:id" component={StoryDetail} />
        <Route path="/safety" component={Safety} />
        <Route path="/help" component={Help} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;
