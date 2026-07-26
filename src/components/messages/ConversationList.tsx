import { useState, useRef, useEffect, useMemo } from "react";
import { Conversation, UserPresenceStatus } from "./types";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import { enrollmentApi, EnrolledUserResponse } from "@/services/enrollment.service";
import { MyEnrolledCourseResponse } from "@/types/course";
import { useDebounce } from "@/hooks/useDebounce";
import ConversationHeader from "./ConversationHeader";
import ConversationSearchBar from "./ConversationSearchBar";
import ConversationTabs, { FilterTab } from "./ConversationTabs";
import CourseFilterDropdown, { CourseItem } from "./CourseFilterDropdown";
import EnrolledUserItem from "./EnrolledUserItem";
import ConversationItem from "./ConversationItem";
import { Users } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conv: Conversation) => void;
  onSelectEnrolledUser: (user: EnrolledUserResponse) => void;
  onOpenNewChatModal: () => void;
  myStatus?: UserPresenceStatus;
  onChangeMyStatus?: (status: UserPresenceStatus) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSelectEnrolledUser,
  onOpenNewChatModal,
}: ConversationListProps) {
  const currentUser = useChatCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [searchResults, setSearchResults] = useState<EnrolledUserResponse[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  // Courses list
  const [myCourses, setMyCourses] = useState<CourseItem[]>([]);
  const [hasLoadedCourses, setHasLoadedCourses] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  const [menuOpenConvId, setMenuOpenConvId] = useState<string | null>(null);
  const [mutedConvIds, setMutedConvIds] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const courseDropdownRef = useRef<HTMLDivElement>(null);

  // Lazy load courses on "Nhóm học" tab click
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
      return;
    }

    let isMounted = true;
    setIsSearchingApi(true);

    const courseIdParam = selectedCourseId !== "ALL" ? selectedCourseId : undefined;

    enrollmentApi
      .searchEnrolledUsers({
        page: 1,
        size: 50,
        courseId: courseIdParam,
        query: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
      })
      .then((res) => {
        if (isMounted) {
          const list: EnrolledUserResponse[] = res?.data?.data || [];
          setSearchResults(list);
        }
      })
      .catch(() => {
        if (isMounted) setSearchResults([]);
      })
      .finally(() => {
        if (isMounted) setIsSearchingApi(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, selectedCourseId]);

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
            <div className="px-3 py-1.5 bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3 h-3 text-accent" />
              <span>Thành viên ({searchResults.filter((u) => u.id !== currentUser.id).length})</span>
            </div>

            {searchResults.filter((u) => u.id !== currentUser.id).length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground font-medium">
                Không tìm thấy thành viên nào
              </div>
            ) : (
              searchResults
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
                ))
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
              onDeleteConversation={() => setMenuOpenConvId(null)}
              menuRef={menuRef}
            />
          ))
        )}
      </div>
    </div>
  );
}
