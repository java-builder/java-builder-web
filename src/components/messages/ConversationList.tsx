import { useState, useRef, useEffect, useMemo } from "react";
import { Conversation, UserPresenceStatus } from "./types";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import { enrollmentApi, EnrolledUserResponse } from "@/services/enrollment.service";
import { userApi } from "@/services/user.service";
import { MyEnrolledCourseResponse } from "@/types/course";
import { useDebounce } from "@/hooks/useDebounce";
import ConversationHeader from "./ConversationHeader";
import ConversationSearchBar from "./ConversationSearchBar";
import ConversationTabs, { FilterTab } from "./ConversationTabs";
import CourseFilterDropdown, { CourseItem } from "./CourseFilterDropdown";
import EnrolledUserItem from "./EnrolledUserItem";
import ConversationItem from "./ConversationItem";
import { Users, Loader2, ChevronDown } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conv: Conversation) => void;
  onSelectEnrolledUser: (user: EnrolledUserResponse) => void;
  onOpenNewChatModal: () => void;
  onToggleSidebar?: () => void;
  onDeleteConversation?: (convId: string) => void;
  myStatus?: UserPresenceStatus;
  onChangeMyStatus?: (status: UserPresenceStatus) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSelectEnrolledUser,
  onOpenNewChatModal,
  onToggleSidebar,
  onDeleteConversation,
}: ConversationListProps) {
  const currentUser = useChatCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [searchResults, setSearchResults] = useState<EnrolledUserResponse[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);
  const [isLoadingMoreSearch, setIsLoadingMoreSearch] = useState(false);
  const [totalSearchElements, setTotalSearchElements] = useState(0);

  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  // Courses list
  const [myCourses, setMyCourses] = useState<CourseItem[]>([]);
  const [hasLoadedCourses, setHasLoadedCourses] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  // Admin user state for "Quản trị" tab
  const [adminUser, setAdminUser] = useState<EnrolledUserResponse | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  const [menuOpenConvId, setMenuOpenConvId] = useState<string | null>(null);
  const [mutedConvIds, setMutedConvIds] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const courseDropdownRef = useRef<HTMLDivElement>(null);

  // Lazy load courses on "Nhóm học" tab click, or fetch Admin user on "Quản trị" tab click
  const handleSelectTab = (tab: FilterTab) => {
    setFilterTab(tab);
    if (tab !== "groups") {
      setSelectedCourseId("ALL");
    }
    if (tab === "all") {
      setSearchQuery("");
      setSelectedCourseId("ALL");
    }
    if (tab === "groups" && (!hasLoadedCourses || myCourses.length === 0)) {
      setIsLoadingCourses(true);
      enrollmentApi
        .getMyCourses(1, 50)
        .then((res) => {
          const list = res?.data?.data || [];
          if (list.length > 0) {
            setMyCourses(
              list.map((item: MyEnrolledCourseResponse) => ({
                id: item.id || String(Math.random()),
                title: item.title || "Khóa học",
                thumbnailUrl: item.thumbnailUrl,
                level: item.level,
                courseFormat: item.courseFormat,
                duration: item.duration ?? 0,
                completedLessons: item.completedLessons ?? 0,
                totalLessons: item.totalLessons ?? 0,
                progress: item.progress ?? 0,
              }))
            );
          }
        })
        .finally(() => {
          setHasLoadedCourses(true);
          setIsLoadingCourses(false);
        });
    }
    if (tab === "admin" && !adminUser) {
      setIsLoadingAdmin(true);
      userApi
        .getDefaultAdminUser()
        .then((res) => {
          const u = res?.data;
          if (u) {
            setAdminUser({
              id: u.id,
              username: u.username || u.email,
              avatar: u.avatar || "",
              email: u.email,
              role: "ADMIN",
              courseName: "Quản trị viên Hệ thống",
              status: "online",
            });
          }
        })
        .catch((err) => {
          console.error("Lỗi khi tải thông tin Admin mặc định:", err);
        })
        .finally(() => {
          setIsLoadingAdmin(false);
        });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenConvId(null);
      }
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(e.target as Node)) {
        setIsCourseDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch enrolled users when searching or selecting course
  useEffect(() => {
    if (!debouncedSearch.trim() && selectedCourseId === "ALL") {
      setSearchResults([]);
      setIsSearchingApi(false);
      setHasMoreSearch(false);
      setSearchPage(1);
      setTotalSearchElements(0);
      return;
    }

    let isMounted = true;
    setIsSearchingApi(true);
    setSearchPage(1);

    const courseIdParam = selectedCourseId !== "ALL" ? selectedCourseId : undefined;

    enrollmentApi.searchEnrolledUsers({
      page: 1,
      size: 20,
      courseId: courseIdParam,
      query: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
    })
      .then((res) => {
        if (isMounted) {
          const list: EnrolledUserResponse[] = res?.data?.data || [];
          const uniqueList = Array.from(new Map(list.map((u) => [u.id, u])).values());
          setSearchResults(uniqueList);
          const currentPage = res?.data?.currentPage || 1;
          const totalPages = res?.data?.totalPages || 1;
          setHasMoreSearch(currentPage < totalPages);
          setTotalSearchElements(res?.data?.totalElements || uniqueList.length);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSearchResults([]);
          setHasMoreSearch(false);
          setTotalSearchElements(0);
        }
      })
      .finally(() => {
        if (isMounted) setIsSearchingApi(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, selectedCourseId]);

  const handleLoadMoreSearch = async () => {
    if (isLoadingMoreSearch || !hasMoreSearch) return;

    setIsLoadingMoreSearch(true);
    const nextPage = searchPage + 1;
    const courseIdParam = selectedCourseId !== "ALL" ? selectedCourseId : undefined;

    try {
      const res = await enrollmentApi.searchEnrolledUsers({
        page: nextPage,
        size: 20,
        courseId: courseIdParam,
        query: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
      });

      const list: EnrolledUserResponse[] = res?.data?.data || [];
      if (list.length > 0) {
        setSearchResults((prev) => {
          const combined = [...prev, ...list];
          return Array.from(new Map(combined.map((u) => [u.id, u])).values());
        });
        setSearchPage(nextPage);
        const currentPage = res?.data?.currentPage || nextPage;
        const totalPages = res?.data?.totalPages || nextPage;
        setHasMoreSearch(currentPage < totalPages);
      } else {
        setHasMoreSearch(false);
      }
    } catch (err) {
      console.error("Lỗi khi tải thêm thành viên:", err);
    } finally {
      setIsLoadingMoreSearch(false);
    }
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let list = [...conversations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.courseTag && c.courseTag.toLowerCase().includes(q))
      );
    }

    return list.filter((conv) => {
      if (filterTab === "unread") return conv.unreadCount > 0;
      if (filterTab === "groups") {
        if (conv.type !== "GROUP") return false;
        if (selectedCourseId !== "ALL") {
          const selectedCourse = myCourses.find((c) => c.id === selectedCourseId);
          if (selectedCourse && conv.courseTag) {
            return (
              conv.courseTag.toLowerCase().includes(selectedCourse.title.toLowerCase()) ||
              selectedCourse.title.toLowerCase().includes(conv.courseTag.toLowerCase())
            );
          }
        }
        return true;
      }
      if (filterTab === "admin") return conv.isPinned || conv.type === "GROUP";
      return true;
    });
  }, [conversations, searchQuery, filterTab, selectedCourseId, myCourses]);

  const showSearchResults =
    searchQuery.trim().length > 0 || (filterTab === "groups" && selectedCourseId !== "ALL");

  return (
    <div className="w-full md:w-80 h-full bg-card text-card-foreground border-r border-border flex flex-col shadow-2xs select-none">
      {/* Header Component */}
      <ConversationHeader
        currentUser={currentUser}
        onOpenNewChatModal={onOpenNewChatModal}
        onToggleSidebar={onToggleSidebar}
      />

      {/* Search Input Component */}
      <ConversationSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchingApi={isSearchingApi}
      />

      {/* Filter Tabs Component */}
      <ConversationTabs
        activeTab={filterTab}
        onSelectTab={handleSelectTab}
        conversations={conversations}
      />

      {/* Course Filter Dropdown Component */}
      {filterTab === "groups" && (
        <CourseFilterDropdown
          isLoadingCourses={isLoadingCourses}
          selectedCourseId={selectedCourseId}
          isCourseDropdownOpen={isCourseDropdownOpen}
          onToggleDropdown={() => setIsCourseDropdownOpen((prev) => !prev)}
          onSelectCourse={(id) => {
            setSelectedCourseId(id);
            setIsCourseDropdownOpen(false);
          }}
          myCourses={myCourses}
          dropdownRef={courseDropdownRef}
        />
      )}

      {/* Conversation List / Search Results Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/40 custom-scrollbar">
        {showSearchResults ? (
          <div>
            <div className="px-3 py-1.5 bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-accent" />
                <span>Thành viên</span>
              </span>
              {isSearchingApi ? (
                <span className="flex items-center gap-1 text-[10px] text-accent font-semibold animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Đang tìm...
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {searchResults.filter((u) => u.id !== currentUser.id).length} kết quả
                </span>
              )}
            </div>

            {isSearchingApi ? (
              <div className="p-2 space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/30 border border-border/40 animate-pulse"
                  >
                    <div className="w-9 h-9 rounded-full bg-muted/80 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted/80 rounded-md w-28" />
                      <div className="h-2 bg-muted/60 rounded-md w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.filter((u) => u.id !== currentUser.id).length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground font-medium">
                Không tìm thấy thành viên nào
              </div>
            ) : (
              <div>
                {searchResults
                  .filter((u) => u.id !== currentUser.id)
                  .map((user) => (
                    <EnrolledUserItem
                      key={user.id}
                      user={user}
                      onSelectUser={(u) => {
                        setSelectedCourseId("ALL");
                        setSearchQuery("");
                        setFilterTab("all");
                        onSelectEnrolledUser(u);
                      }}
                    />
                  ))}

                {/* Load More Button for Pagination */}
                {hasMoreSearch && (
                  <div className="p-3 text-center">
                    <button
                      type="button"
                      onClick={handleLoadMoreSearch}
                      disabled={isLoadingMoreSearch}
                      className="w-full py-2 px-3 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isLoadingMoreSearch ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang tải thêm...</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Xem thêm thành viên ({searchResults.length}/{totalSearchElements})</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : filterTab === "admin" ? (
          <div>
            <div className="px-3 py-1.5 bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3 h-3 text-accent" />
              <span>Quản trị viên Hỗ trợ</span>
            </div>

            {isLoadingAdmin ? (
              <div className="p-3 flex items-center gap-3 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-muted/80 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-muted/80 rounded-md w-32" />
                  <div className="h-2.5 bg-muted/60 rounded-md w-24" />
                </div>
              </div>
            ) : adminUser ? (
              <EnrolledUserItem
                user={adminUser}
                onSelectUser={(u) => {
                  setFilterTab("all");
                  onSelectEnrolledUser(u);
                }}
              />
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground font-medium">
                Chưa có thông tin Quản trị viên
              </div>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              currentUser={currentUser}
              isActive={conv.id === activeConversationId}
              isMuted={mutedConvIds.includes(conv.id)}
              menuOpenConvId={menuOpenConvId}
              onSelectConversation={onSelectConversation}
              onToggleMenu={(id, e) => {
                e.stopPropagation();
                setMenuOpenConvId((prev) => (prev === id ? null : id));
              }}
              onToggleMute={(id) => {
                setMutedConvIds((prev) =>
                  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                );
                setMenuOpenConvId(null);
              }}
              onTogglePin={(c) => {
                c.isPinned = !c.isPinned;
                setMenuOpenConvId(null);
              }}
              onToggleUnread={(c) => {
                c.unreadCount = c.unreadCount > 0 ? 0 : 1;
                setMenuOpenConvId(null);
              }}
              onDeleteConversation={(convId) => {
                setMenuOpenConvId(null);
                onDeleteConversation?.(convId);
              }}
              menuRef={menuRef}
            />
          ))
        )}
      </div>
    </div>
  );
}
