"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Conversation, UserPresenceStatus } from "@/components/messages/types";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import { enrollmentApi, EnrolledUserResponse } from "@/services/enrollment.service";
import { courseApi } from "@/services/course.service";
import { useDebounce } from "@/hooks/useDebounce";
import ConversationHeader from "@/components/messages/ConversationHeader";
import ConversationSearchBar from "@/components/messages/ConversationSearchBar";
import ConversationTabs, { FilterTab } from "@/components/messages/ConversationTabs";
import CourseFilterDropdown, { CourseItem } from "@/components/messages/CourseFilterDropdown";
import EnrolledUserItem from "@/components/messages/EnrolledUserItem";
import ConversationItem from "@/components/messages/ConversationItem";
import { Users, Loader2 } from "lucide-react";

interface AdminConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conv: Conversation) => void;
  onSelectEnrolledUser: (user: EnrolledUserResponse) => void;
  onOpenNewChatModal: () => void;
  onToggleSidebar?: () => void;
  onDeleteConversation?: (convId: string) => void;
  mutedConvIds?: string[];
  onToggleMute?: (convId: string) => void;
  onTogglePin?: (conv: Conversation) => void;
  onToggleUnread?: (conv: Conversation) => void;
  myStatus?: UserPresenceStatus;
  onChangeMyStatus?: (status: UserPresenceStatus) => void;
}

export default function AdminConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSelectEnrolledUser,
  onOpenNewChatModal,
  onToggleSidebar,
  onDeleteConversation,
  mutedConvIds: externalMutedConvIds,
  onToggleMute: externalOnToggleMute,
  onTogglePin: externalOnTogglePin,
  onToggleUnread: externalOnToggleUnread,
}: AdminConversationListProps) {
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

  // Admin System Courses list
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [hasLoadedCourses, setHasLoadedCourses] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  const [menuOpenConvId, setMenuOpenConvId] = useState<string | null>(null);
  const [localMutedConvIds, setLocalMutedConvIds] = useState<string[]>([]);

  const mutedConvIds = externalMutedConvIds || localMutedConvIds;
  const menuRef = useRef<HTMLDivElement>(null);
  const courseDropdownRef = useRef<HTMLDivElement>(null);

  // Lazy load ALL courses from courseApi.getCourses on "Nhóm học" tab click
  const handleSelectTab = (tab: FilterTab) => {
    setFilterTab(tab);
    if (tab !== "groups") {
      setSelectedCourseId("ALL");
    }
    if (tab === "all") {
      setSearchQuery("");
      setSelectedCourseId("ALL");
    }
    if (tab === "groups" && (!hasLoadedCourses || courses.length === 0)) {
      setIsLoadingCourses(true);
      courseApi
        .getCourses(1, 100)
        .then((res) => {
          const raw = res?.data?.data;
          const list = Array.isArray(raw) ? raw : [];
          if (list.length > 0) {
            setCourses(
              list.map((item) => ({
                id: item.id || String(Math.random()),
                title: item.title || "Khóa học",
                thumbnailUrl: item.thumbnailUrl,
                level: item.level,
                courseFormat: item.courseFormat,
                duration: 0,
                completedLessons: 0,
                totalLessons: item.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) ?? 0,
                progress: 0,
              }))
            );
          }
        })
        .catch((err) => {
          console.error("Lỗi khi tải danh sách khóa học Admin:", err);
        })
        .finally(() => {
          setHasLoadedCourses(true);
          setIsLoadingCourses(false);
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

    enrollmentApi
      .searchEnrolledUsers({
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
          const selectedCourse = courses.find((c) => c.id === selectedCourseId);
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
  }, [conversations, searchQuery, filterTab, selectedCourseId, courses]);

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
          myCourses={courses}
          dropdownRef={courseDropdownRef}
        />
      )}

      {/* List Content Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/40 custom-scrollbar">
        {showSearchResults ? (
          <div>
            <div className="px-4 py-2 text-[11px] font-bold text-muted-foreground uppercase bg-muted/30 border-b border-border/50 flex justify-between items-center">
              <span>Học viên ({totalSearchElements})</span>
              {isSearchingApi && <Loader2 className="w-3 h-3 animate-spin text-accent" />}
            </div>

            {searchResults.length > 0 ? (
              <>
                {searchResults.map((user) => (
                  <EnrolledUserItem
                    key={user.id}
                    user={user}
                    onSelectUser={onSelectEnrolledUser}
                  />
                ))}

                {hasMoreSearch && (
                  <div className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={handleLoadMoreSearch}
                      disabled={isLoadingMoreSearch}
                      className="w-full py-1.5 px-3 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isLoadingMoreSearch ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang tải...</span>
                        </>
                      ) : (
                        <span>Tải thêm học viên</span>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : !isSearchingApi ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                Không tìm thấy học viên phù hợp
              </div>
            ) : null}
          </div>
        ) : (
          /* Normal Conversation List */
          <div>
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  currentUser={currentUser}
                  isActive={conv.id === activeConversationId}
                  isMuted={mutedConvIds.includes(conv.id)}
                  menuOpenConvId={menuOpenConvId}
                  menuRef={menuRef}
                  onSelectConversation={onSelectConversation}
                  onToggleMenu={(id, e) => {
                    e.stopPropagation();
                    setMenuOpenConvId(menuOpenConvId === id ? null : id);
                  }}
                  onTogglePin={externalOnTogglePin || (() => {})}
                  onToggleMute={
                    externalOnToggleMute ||
                    ((convId) => {
                      setLocalMutedConvIds((prev) =>
                        prev.includes(convId) ? prev.filter((id) => id !== convId) : [...prev, convId]
                      );
                    })
                  }
                  onToggleUnread={externalOnToggleUnread || (() => {})}
                  onDeleteConversation={onDeleteConversation || (() => {})}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-foreground">Chưa có cuộc trò chuyện nào</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Bắt đầu nhắn tin với học viên hoặc nhóm học
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
